package com.easyquiz.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.easyquiz.demo.model.Questao;

public interface QuestaoRepository extends JpaRepository<Questao, Integer> {
    // Este método mágico cria a query "SELECT COUNT(*) FROM questao WHERE tipo = ?"
    long countByTipo(String tipo);
}