package com.easyquiz.demo.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.ForeignKey;
import java.time.LocalDateTime;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "log_cadastro")
public class LogCadastro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "admin_id", referencedColumnName = "id",
            foreignKey = @ForeignKey(name = "fk_logcadastro_admin"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Usuario admin;

    @ManyToOne(optional = true) 
    @JoinColumn(name = "professor_id", referencedColumnName = "id",
            foreignKey = @ForeignKey(name = "fk_logcadastro_professor"))
    private Usuario professor;

    @Column(name = "nome_usuario", length = 100)
    private String nomeUsuario;

    @Column(name = "data_hora", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime dataHora;

    @Column(name = "acao", nullable = false, length = 15)
    private String acao;
}