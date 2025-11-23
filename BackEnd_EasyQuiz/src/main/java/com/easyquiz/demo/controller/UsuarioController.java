package com.easyquiz.demo.controller;

import com.easyquiz.demo.model.LogCadastro;
import com.easyquiz.demo.model.Usuario;
import com.easyquiz.demo.repository.UsuarioRepository;
import com.easyquiz.demo.service.EmailService;
import com.easyquiz.demo.repository.LogCadastroRepository;
import com.easyquiz.demo.dto.ChangePasswordDTO; // Importante

import java.util.*;
import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;
    private final LogCadastroRepository logCadastroRepository;

    public UsuarioController(UsuarioRepository usuarioRepository, EmailService emailService, LogCadastroRepository logCadastroRepository) {
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
        this.logCadastroRepository = logCadastroRepository;
    }

    // --- Métodos de Consulta ---

    @GetMapping("/listar")
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obterUsuarioPorId(@PathVariable Integer id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        return usuario.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

// --- Endpoint de Cadastro (Admin) ---

    @PostMapping("/cadastrar/{adminId}") 
    public ResponseEntity<Usuario> criarUsuario(@RequestBody Usuario usuario, @PathVariable Integer adminId) {
        // Verifica se o admin existe
        Optional<Usuario> adminOpt = usuarioRepository.findById(adminId);
        if (adminOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Usuario admin = adminOpt.get();
        if(!admin.getTipo().equals("ADMIN")) { 
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        // Cria senha aleatória
        String senhaAleatoria = UUID.randomUUID().toString().substring(0, 16).replace("-", "");
        usuario.setSenha(senhaAleatoria);
        usuario.setCriadoEm(LocalDateTime.now());
        
        Usuario novoUsuario = usuarioRepository.save(usuario); // <--- USUÁRIO SALVO AQUI

        // Tenta enviar email, mas não quebra se falhar
        try {
            String textoEmail = "Sua senha é: " + senhaAleatoria;
            String assuntoEmail = "Senha de Acesso - EasyQuiz";
            emailService.enviarEmailSimples(usuario.getEmail(), assuntoEmail, textoEmail);
        } catch (Exception e) {
            System.err.println("ERRO AO ENVIAR E-MAIL: " + e.getMessage());
            // O código continua mesmo com erro no email
        }

        // Tenta salvar o Log
        try {
            LogCadastro log = new LogCadastro();
            log.setAdmin(admin);
            log.setProfessor(novoUsuario);
            log.setDataHora(LocalDateTime.now());
            log.setAcao("CADASTRO"); 
            logCadastroRepository.save(log);
        } catch (Exception e) {
            System.err.println("ERRO AO SALVAR LOG: " + e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
    }

    // --- Endpoint de Atualização Padrão (Self-Update) ---

    @PutMapping("/update/{id}")
    public ResponseEntity<Usuario> atualizarUsuario(@PathVariable Integer id, @RequestBody Usuario usuarioAtualizado) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setNome(usuarioAtualizado.getNome());
                    usuario.setEmail(usuarioAtualizado.getEmail());
                    Usuario usuarioSalvo = usuarioRepository.save(usuario);
                    return ResponseEntity.ok(usuarioSalvo);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    // --- Endpoint de Atualização Administrativa com Log ---

    @PutMapping("/admUpdate/{userId}/{adminId}")
    public ResponseEntity<Usuario> atualizarUsuario_Admin(
            @PathVariable Integer userId, 
            @PathVariable Integer adminId, 
            @RequestBody Usuario usuarioAtualizado) {
        
        // 1. Valida o Administrador
        Optional<Usuario> adminOpt = usuarioRepository.findById(adminId);
        if (adminOpt.isEmpty() || !adminOpt.get().getTipo().equals("ADMIN")) {
             System.out.println("Admin com id " + adminId + " não encontrado ou não autorizado.");
             return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Usuario admin = adminOpt.get();

        // 2. Procura e Atualiza o Usuário
        return usuarioRepository.findById(userId)
                .map(usuario -> {
                    usuario.setNome(usuarioAtualizado.getNome());
                    usuario.setEmail(usuarioAtualizado.getEmail());
                    usuario.setTipo(usuarioAtualizado.getTipo());
                    Usuario usuarioSalvo = usuarioRepository.save(usuario);
                    
                    // 3. REGISTRO DE LOG: ALTERAÇÃO
                    LogCadastro log = new LogCadastro();
                    log.setAdmin(admin);
                    log.setProfessor(usuarioSalvo);
                    log.setDataHora(LocalDateTime.now());
                    log.setAcao("ALTERACAO");
                    logCadastroRepository.save(log);
                    System.out.println("Registrado log de alteração de usuário de id: " + userId + " pelo admin id: " + admin.getId());

                    return ResponseEntity.ok(usuarioSalvo);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

@PutMapping("/mudarSenha/{id}")
    public ResponseEntity<?> atualizarSenha(@PathVariable Integer id, @RequestBody ChangePasswordDTO dadosSenha) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Usuario usuario = usuarioOpt.get();

        // Valida se a senha atual bate com a do banco
        if (!usuario.getSenha().equals(dadosSenha.getSenhaAtual())) {
            System.out.println("Senha atual incorreta para usuário id " + id);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("A senha atual está incorreta.");
        }

        // Atualiza
        usuario.setSenha(dadosSenha.getNovaSenha());
        usuarioRepository.save(usuario);
        
        System.out.println("Senha alterada com sucesso para o usuário id: " + id);
        return ResponseEntity.ok().build();
    }

    // --- Endpoint de Exclusão Administrativa com Log ---

    @DeleteMapping("/delete/{userId}/{adminId}")
    public ResponseEntity<Void> deletarUsuario_Admin(
            @PathVariable Integer userId, 
            @PathVariable Integer adminId) {
        
        Optional<Usuario> adminOpt = usuarioRepository.findById(adminId);
        if (adminOpt.isEmpty() || !adminOpt.get().getTipo().equals("ADMIN")) {
             return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Usuario admin = adminOpt.get();

        return usuarioRepository.findById(userId)
                .map(usuario -> {
                    Usuario usuarioParaLog = new Usuario();
                    usuarioParaLog.setId(userId);
                    
                    try {
                        LogCadastro log = new LogCadastro();
                        log.setAdmin(admin);
                        log.setProfessor(usuarioParaLog);
                        log.setDataHora(LocalDateTime.now());
                        log.setAcao("EXCLUSAO");
                        logCadastroRepository.save(log);
                    } catch (Exception e) {
                        System.err.println("Erro ao registrar log de exclusão: " + e.getMessage());
                    }

                    usuarioRepository.deleteById(userId);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // --- Endpoint de Login ---

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Map<String, String> credenciais) {
        String email = credenciais.get("email");
        String senha = credenciais.get("senha");

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            if (usuario.getSenha().equals(senha)) {
                return ResponseEntity.ok(usuario);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}