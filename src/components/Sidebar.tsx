import Link from 'next/link';

export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Gerar Prova', href: '/dashboard/generator' },
    { name: 'Minhas Questões', href: '/dashboard/questions' },
    { name: 'Criar Questão', href: '/dashboard/questions/new' },
    { name: 'Disciplinas', href: '/dashboard/disciplinas' },
    { name: 'Cadastrar Novo Usuário', href: '/dashboard/users/new' },
    { name: 'Logs', href: '/dashboard/logs' },
  ];

  return (
    <nav className="w-64 h-screen bg-gray-800 text-white flex-shrink-0 p-4">
      <h2 className="text-2xl font-semibold mb-6">Meu Painel</h2>
      
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className="block px-4 py-2 rounded-md hover:bg-gray-700"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}