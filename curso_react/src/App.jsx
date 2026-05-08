import CursoApp from './CursoApp';

function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand fw-semibold">Cursos</span>
          <span className="navbar-text small opacity-75 d-none d-md-inline">
            Panel de gestión
          </span>
        </div>
      </nav>

      <main className="py-4">
        <CursoApp />
      </main>
    </>
  );
}

export default App;
