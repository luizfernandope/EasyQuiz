package com.easyquiz.demo.controller;

import com.easyquiz.demo.dto.QuestaoDTO;
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    // --- CADASTRAR ---
    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrarCompleta(@RequestBody QuestaoDTO dto) {
        try {
            if (dto.getEnunciado() == null || dto.getEnunciado().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("O enunciado da questão é obrigatório.");
            }

            Questao questao = new Questao();
            String enunciado = dto.getEnunciado();
            // Proteção para o limite de caracteres do título
            questao.setTitulo(enunciado.length() > 50 ? enunciado.substring(0, 50) : enunciado);
            questao.setDescricao(enunciado);
            
            questao.setDificuldade(dto.getDificuldade());
            questao.setTipo(dto.getTipo());
            questao.setDataCriacao(LocalDateTime.now());
            questao.setDataUltimaModificacao(LocalDateTime.now());

            // Associa Disciplina
            if (dto.getDisciplinaId() != null) {
                disciplinaRepository.findById(dto.getDisciplinaId()).ifPresent(questao::setDisciplina);
            }

            // Associa Criador
            if (dto.getCriadorId() != null) {
                Optional<Usuario> user = usuarioRepository.findById(dto.getCriadorId());
                if (user.isPresent()) {
                    questao.setCriadoPor(user.get());
                } else {
                    return ResponseEntity.badRequest().body("Criador não encontrado.");
                }
            } else {
                return ResponseEntity.badRequest().body("ID do criador é obrigatório.");
            }

            // Salva a Questão
            Questao salva = repository.save(questao);

            // Salva as Opções
            if (dto.getOpcoes() != null && !dto.getOpcoes().isEmpty()) {
                List<OpcaoResposta> novasOpcoes = new ArrayList<>();
                for (var optDto : dto.getOpcoes()) {
                    if (optDto == null) continue;
                    OpcaoResposta op = new OpcaoResposta();
                    op.setTextoResposta(optDto.getTexto() != null ? optDto.getTexto() : ""); 
                    op.setCorreta(optDto.isCorreta());
                    op.setQuestao(salva);
                    novasOpcoes.add(op);
                }

                if (salva.getOpcoes() == null) salva.setOpcoes(new ArrayList<>());
                
                // Limpa e adiciona para evitar erro de orphan deletion do Hibernate
                salva.getOpcoes().clear();
                salva.getOpcoes().addAll(novasOpcoes);

                repository.save(salva); 
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(salva);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erro interno: " + e.toString());
        }
    }

    // --- ATUALIZAR (EDITAR) ---
    @PutMapping("/update/{id}")
    public ResponseEntity<?> atualizarQuestao(@PathVariable Integer id, @RequestBody QuestaoDTO dto) {
        try {
            Optional<Questao> questaoOpt = repository.findById(id);
            if (questaoOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Questao questao = questaoOpt.get();

            // Atualiza campos básicos
            String enunciado = dto.getEnunciado();
            if (enunciado != null && !enunciado.trim().isEmpty()) {
                questao.setTitulo(enunciado.length() > 50 ? enunciado.substring(0, 50) : enunciado);
                questao.setDescricao(enunciado);
            }
            
            questao.setDificuldade(dto.getDificuldade());
            questao.setTipo(dto.getTipo());
            questao.setDataUltimaModificacao(LocalDateTime.now());

            // Atualiza Disciplina
            if (dto.getDisciplinaId() != null) {
                disciplinaRepository.findById(dto.getDisciplinaId()).ifPresent(questao::setDisciplina);
            }

            // Atualiza Opções
            if (dto.getOpcoes() != null) {
                List<OpcaoResposta> novasOpcoes = new ArrayList<>();
                for (var optDto : dto.getOpcoes()) {
                    OpcaoResposta op = new OpcaoResposta();
                    op.setTextoResposta(optDto.getTexto() != null ? optDto.getTexto() : ""); 
                    op.setCorreta(optDto.isCorreta());
                    op.setQuestao(questao);
                    novasOpcoes.add(op);
                }

                if (questao.getOpcoes() == null) {
                    questao.setOpcoes(new ArrayList<>());
                }
                
                questao.getOpcoes().clear(); 
                questao.getOpcoes().addAll(novasOpcoes); 
            }

            Questao salva = repository.save(questao);
            return ResponseEntity.ok(salva);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erro ao atualizar: " + e.getMessage());
        }
    }

    // --- DELETAR ---
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // --- ESTATÍSTICAS (DASHBOARD) ---
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getEstatisticas() {
        Map<String, Long> stats = new HashMap<>();
        
        
        stats.put("total", repository.count());

        stats.put("multipla", repository.countByTipo("Multipla Escolha"));
        stats.put("vf", repository.countByTipo("Verdadeiro/Falso"));
        stats.put("dissertativa", repository.countByTipo("Dissertativa"));
        
        return ResponseEntity.ok(stats);
    }
}