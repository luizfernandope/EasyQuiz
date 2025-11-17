package com.easyquiz.demo.controller;
import com.easyquiz.demo.model.LogCadastro;
import com.easyquiz.demo.model.Usuario;
import com.easyquiz.demo.repository.UsuarioRepository;
import com.easyquiz.demo.service.EmailService;
import com.easyquiz.demo.repository.LogCadastroRepository;

import java.util.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;


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

    // Parâmetro de path alterado para 'adminId' para maior clareza
    @PostMapping("/cadastrar/{adminId}") 
    public ResponseEntity<Usuario> criarUsuario(@RequestBody Usuario usuario, @PathVariable Integer adminId) {
        // Verifica se o admin existe
        Optional<Usuario> adminOpt = usuarioRepository.findById(adminId);
        if (adminOpt.isEmpty()) {
            System.out.println("Admin com id " + adminId + " não encontrado.");
            return ResponseEntity.notFound().build();
        }
        Usuario admin = adminOpt.get();
        if(!admin.getTipo().equals("ADMIN"))    
        { 
            System.out.println("Usuário com id " + adminId + " não é um admin.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        //cria uma senha aleatória para o usuário, com 16 caracteres
        String senhaAleatoria = UUID.randomUUID().toString().substring(0, 16).replace("-", "");
        usuario.setSenha(senhaAleatoria);

        usuario.setCriadoEm(LocalDateTime.now());
        Usuario novoUsuario = usuarioRepository.save(usuario);
        System.out.println("Usuario cadastrado com id: " + novoUsuario.getId());

        // Envia email com a senha para o usuário
        String textoEmail = "Sua senha é: " + senhaAleatoria;
        String assuntoEmail = "Senha de Acesso - EasyQuiz";
        emailService.enviarEmailSimples(usuario.getEmail(), assuntoEmail, textoEmail);

        // REGISTRO DE LOG: CADASTRO
        LogCadastro log = new LogCadastro();
        log.setAdmin(admin);
        log.setProfessor(novoUsuario);
        log.setDataHora(LocalDateTime.now());
        // Se o campo 'acao' (String) foi adicionado a LogCadastro: log.setAcao("CADASTRO");
        System.out.println("Registrando log de cadastro: Admin ID " + admin.getId() + ", Professor ID " + novoUsuario.getId());
        logCadastroRepository.save(log);
        System.out.println("Cadastrado log de novo usuário de id: " + novoUsuario.getId() + " pelo admin id: " + admin.getId());

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

    // Modificado para incluir 'adminId' para fins de auditoria
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
                    log.setProfessor(usuarioSalvo); // Usuário alterado
                    log.setDataHora(LocalDateTime.now());
                    log.setAcao("ALTERACAO");
                    logCadastroRepository.save(log);
                    System.out.println("Registrado log de alteração de usuário de id: " + userId + " pelo admin id: " + admin.getId());

                    return ResponseEntity.ok(usuarioSalvo);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/mudarSenha/{id}")
    public ResponseEntity<Usuario> atualizarSenha(@PathVariable Integer id, @RequestBody String novaSenha) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setSenha(novaSenha);
                    Usuario usuarioSalvo = usuarioRepository.save(usuario);
                    return ResponseEntity.ok(usuarioSalvo);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // --- Novo Endpoint de Exclusão Administrativa com Log ---

    @DeleteMapping("/delete/{userId}/{adminId}")
    public ResponseEntity<Void> deletarUsuario_Admin(
            @PathVariable Integer userId, 
            @PathVariable Integer adminId) {
        
        // 1. Valida o Administrador
        Optional<Usuario> adminOpt = usuarioRepository.findById(adminId);
        if (adminOpt.isEmpty() || !adminOpt.get().getTipo().equals("ADMIN")) {
             System.out.println("Admin com id " + adminId + " não encontrado ou não autorizado.");
             return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Usuario admin = adminOpt.get();

        // 2. Procura e Exclui o Usuário
        return usuarioRepository.findById(userId)
                .map(usuario -> {
                    // Prepara um objeto "mock" do usuário a ser excluído para o log, 
                    // pois o 'LogCadastro' requer um objeto 'Usuario' (professor) válido 
                    // para a foreign key, mas o log precisa ser salvo antes da exclusão.
                    Usuario usuarioParaLog = new Usuario();
                    usuarioParaLog.setId(userId);
                    
                    // 3. REGISTRO DE LOG: EXCLUSÃO (Realizado antes do delete para auditoria)
                    try {
                        LogCadastro log = new LogCadastro();
                        log.setAdmin(admin);
                        log.setProfessor(usuarioParaLog); // Usuário excluído
                        log.setDataHora(LocalDateTime.now());
                        log.setAcao("EXCLUSAO");
                        logCadastroRepository.save(log);
                        System.out.println("Log de exclusão de usuário de id: " + userId + " registrado pelo admin id: " + admin.getId());
                    } catch (Exception e) {
                        System.err.println("Erro ao registrar log de exclusão: " + e.getMessage());
                        // O erro no log não deve impedir a exclusão, mas é um aviso
                    }

                    usuarioRepository.deleteById(userId);
                    System.out.println("Usuário de id: " + userId + " excluído.");
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // --- Endpoint de Login ---

    //metodo para fazer login
    @PostMapping("/login") //post para não expor credenciais na url
    public ResponseEntity<Usuario> login(@RequestBody Map<String, String> credenciais) {
        String email = credenciais.get("email");
        String senha = credenciais.get("senha");

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            if (usuario.getSenha().equals(senha)) {
                return ResponseEntity.ok(usuario);
            } else {
                System.out.println("Senha incorreta");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } else {
            System.out.println("Usuário não encontrado");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }


}