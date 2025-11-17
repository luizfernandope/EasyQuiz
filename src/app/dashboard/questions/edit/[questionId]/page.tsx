export default function EditQuestionPage({ params }: { params: { questionId: string } }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Editando Questão: #{params.questionId}</h1>
      <div className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Formulário da Questão</h2>
        <p>(Mesmo formulário da criação, mas pré-preenchido com os dados da questão)</p>
      </div>
    </div>
  );
}