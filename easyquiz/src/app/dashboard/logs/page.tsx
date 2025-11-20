'use client';

import { History, UserCheck, UserPlus, UserX } from 'lucide-react';
import React from 'react';

// Tipos para os dados de log (baseados no backend LogCadastro.java)
type LogAction = 'CADASTRO' | 'ALTERACAO' | 'EXCLUSAO';

type LogEntry = {
  id: number;
  adminNome: string;
  adminId: number;
  acao: LogAction;
  usuarioAlvoNome: string;
  usuarioAlvoEmail: string;
  data: string;
  hora: string;
};

// Dados Mock (simulados) para o Front-end
const mockLogs: LogEntry[] = [
  {
    id: 1,
    adminNome: 'Super Admin',
    adminId: 1,
    acao: 'CADASTRO',
    usuarioAlvoNome: 'Professor João',
    usuarioAlvoEmail: 'joao.prof@easyquiz.com',
    data: '2025-11-15',
    hora: '10:30:00',
  },
  {
    id: 2,
    adminNome: 'Super Admin',
    adminId: 1,
    acao: 'ALTERACAO',
    usuarioAlvoNome: 'Professor Maria',
    usuarioAlvoEmail: 'maria.prof@easyquiz.com',
    data: '2025-11-15',
    hora: '14:45:12',
  },
  {
    id: 3,
    adminNome: 'Admin Jovem',
    adminId: 2,
    acao: 'CADASTRO',
    usuarioAlvoNome: 'Professor Carlos',
    usuarioAlvoEmail: 'carlos.prof@easyquiz.com',
    data: '2025-11-16',
    hora: '09:05:35',
  },
  {
    id: 4,
    adminNome: 'Super Admin',
    adminId: 1,
    acao: 'EXCLUSAO',
    usuarioAlvoNome: 'Ex-Professor Pedro',
    usuarioAlvoEmail: 'pedro.ex@easyquiz.com',
    data: '2025-11-16',
    hora: '16:20:50',
  },
  {
    id: 5,
    adminNome: 'Admin Jovem',
    adminId: 2,
    acao: 'ALTERACAO',
    usuarioAlvoNome: 'Professor Carlos',
    usuarioAlvoEmail: 'carlos.prof@easyquiz.com',
    data: '2025-11-17',
    hora: '08:00:00',
  },
];

// Função auxiliar para definir ícones e cores com base na ação
const getActionDetails = (acao: LogAction) => {
  switch (acao) {
    case 'CADASTRO':
      return {
        label: 'Cadastro de Usuário',
        color: 'text-green-600 bg-green-100',
        icon: UserPlus,
      };
    case 'ALTERACAO':
      return {
        label: 'Alteração de Usuário',
        color: 'text-blue-600 bg-blue-100',
        icon: UserCheck,
      };
    case 'EXCLUSAO':
      return {
        label: 'Exclusão de Usuário',
        color: 'text-red-600 bg-red-100',
        icon: UserX,
      };
    default:
      return {
        label: 'Ação Desconhecida',
        color: 'text-gray-600 bg-gray-100',
        icon: History,
      };
  }
};

export default function LogsPage() {
  return (
    <div className="mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <History size={30} />
        Log de Auditoria (Administrativo)
      </h1>

      <div className="bg-white p-6 shadow-xl rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Administrador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ação
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuário Alvo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data / Hora
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockLogs.map((log) => {
              const details = getActionDetails(log.acao);
              return (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  {/* ID */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.id}
                  </td>
                  
                  {/* Administrador */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {log.adminNome}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {log.adminId}
                    </div>
                  </td>
                  
                  {/* Ação */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-semibold leading-5 rounded-full ${details.color}`}
                    >
                      <details.icon size={14} className="mr-1" />
                      {details.label}
                    </span>
                  </td>
                  
                  {/* Usuário Alvo */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {log.usuarioAlvoNome}
                    </div>
                    <div className="text-xs text-gray-500">
                      {log.usuarioAlvoEmail}
                    </div>
                  </td>
                  
                  {/* Data / Hora */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(log.data).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {log.hora.substring(0, 5)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Mensagem de Logs Vazios (se for o caso) */}
        {mockLogs.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            Nenhum registro de auditoria encontrado.
          </div>
        )}
      </div>
    </div>
  );
}