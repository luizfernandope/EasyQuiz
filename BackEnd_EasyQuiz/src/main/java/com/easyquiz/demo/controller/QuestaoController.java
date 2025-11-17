package com.easyquiz.demo.controller;

import com.easyquiz.demo.model.Questao;
import com.easyquiz.demo.repository.QuestaoRepository;

import java.time.LocalDateTime;
import java.util.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/questao")
public class QuestaoController {

    private final QuestaoRepository repository;

    public QuestaoController(QuestaoRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/listar")
    public List<Questao> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Questao> obterPorId(@PathVariable Integer id) {
        Optional<Questao> questao = repository.findById(id);
        return questao.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<Questao> cadastrar(@RequestBody Questao questao) {
        // Define as datas de criação e última modificação
        questao.setDataCriacao(LocalDateTime.now());
        questao.setDataUltimaModificacao(LocalDateTime.now());
        Questao novaQuestao = repository.save(questao);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaQuestao);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Questao> atualizar(@PathVariable Integer id, @RequestBody Questao questaoAtualizada) {
        return repository.findById(id)
                .map(questao -> {
                    questao.setTitulo(questaoAtualizada.getTitulo());
                    questao.setDescricao(questaoAtualizada.getDescricao());
                    questao.setDificuldade(questaoAtualizada.getDificuldade());
                    questao.setTipo(questaoAtualizada.getTipo());
                    questao.setDisciplinaId(questaoAtualizada.getDisciplinaId());
                    questao.setCriadoPor(questaoAtualizada.getCriadoPor());
                    // Atualiza a data de última modificação
                    questao.setDataUltimaModificacao(LocalDateTime.now());

                    Questao salva = repository.save(questao);
                    return ResponseEntity.ok(salva);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        return repository.findById(id)
                .map(q -> {
                    repository.deleteById(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}