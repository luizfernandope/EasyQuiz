package com.easyquiz.demo.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "opcao_resposta")
public class OpcaoResposta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "questao_id", nullable = false)
    private Integer questaoId;

    @Column(name = "texto_resposta", nullable = false)
    private String textoResposta;

    @Column(name = "correta")
    private Boolean correta;
}