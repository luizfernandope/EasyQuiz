package com.easyquiz.demo.controller;

import com.easyquiz.demo.dto.QuestaoDTO;
import com.easyquiz.demo.model.Disciplina;
import com.easyquiz.demo.model.OpcaoResposta;
import com.easyquiz.demo.model.Questao;
import com.easyquiz.demo.model.Usuario;
import com.easyquiz.demo.repository.DisciplinaRepository;
import com.easyquiz.demo.repository.QuestaoRepository;
import com.easyquiz.demo.repository.UsuarioRepository;
import com.easyquiz.demo.service.QuestaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/questao")
public class QuestaoController {

    private final QuestaoRepository repository;
    private final QuestaoService questaoService;
    private final DisciplinaRepository disciplinaRepository;
    private final UsuarioRepository usuarioRepository;

    public QuestaoController(QuestaoRepository repository, QuestaoService questaoService,
                             DisciplinaRepository disciplinaRepository, UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.questaoService = questaoService;
        this.disciplinaRepository = disciplinaRepository;
        this.usuarioRepository = usuarioRepository;
    }


    @GetMapping("/browse")
    public List<QuestaoDTO> listarParaBrowse() {
        return questaoService.listarTodasFormatadas();
    }

    @GetMapping("/listar")
    public List<Questao> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestaoDTO> obterPorId(@PathVariable Integer id) {
        QuestaoDTO dto = questaoService.buscarPorId(id);
        if (dto != null) return ResponseEntity.ok(dto);
        return ResponseEntity.notFound().build();
    }

  
    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrarCompleta(@RequestBody QuestaoDTO dto) {
        try {
            Questao questao = new Questao();
            questao.setTitulo(dto.getEnunciado().length() > 50 ? dto.getEnunciado().substring(0, 50) : dto.getEnunciado());
            questao.setDescricao(dto.getEnunciado());
            questao.setDificuldade(dto.getDificuldade());
            questao.setTipo(dto.getTipo());
            questao.setDataCriacao(LocalDateTime.now());
            questao.setDataUltimaModificacao(LocalDateTime.now());

            // Busca Disciplina
            if (dto.getDisciplinaId() != null) {
                Optional<Disciplina> disc = disciplinaRepository.findById(dto.getDisciplinaId());
                disc.ifPresent(questao::setDisciplina);
            } else if (dto.getDisciplina() != null) {
               
            }

        
            if (dto.getCriadorId() != null) {
                Optional<Usuario> user = usuarioRepository.findById(dto.getCriadorId());
                if (user.isPresent()) {
                    questao.setCriadoPor(user.get());
                } else {
                    return ResponseEntity.badRequest().body("Criador não encontrado");
                }
            }

           
            Questao salva = repository.save(questao);

           
            if (dto.getOpcoes() != null) {
                List<OpcaoResposta> opcoesEntidade = dto.getOpcoes().stream().map(optDto -> {
                    OpcaoResposta op = new OpcaoResposta();
                    op.setTextoResposta(optDto.getTexto());
                    op.setCorreta(optDto.isCorreta());
                    op.setQuestao(salva); 
                    return op;
                }).toList();
                
                salva.setOpcoes(opcoesEntidade);
                repository.save(salva); 
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(salva);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erro ao salvar: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}