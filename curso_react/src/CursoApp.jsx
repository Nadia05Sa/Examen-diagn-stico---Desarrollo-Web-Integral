import { useState, useEffect } from 'react';
import { read, create, update, deleteM } from './service/api';
import DataTable from 'react-data-table-component';
import toast, { Toaster } from 'react-hot-toast';

export default function CursoApp() {
    const [Curso, setCurso] = useState([]);
    const [formData, setFormData] = useState({ 
        nombre: '', 
        codigo: '', 
        creditos: '', 
        profesor: '', 
        cupo_maximo: '', 
        estado: 'ABIERTO',
    });
    const [editandoId, setEditandoId] = useState(null);
    const [filtro, setFiltro] = useState('');
    const [cargandoTabla, setCargandoTabla] = useState(false);
    const [cargandoGuardar, setCargandoGuardar] = useState(false);
    const [erroresBackend, setErroresBackend] = useState({});

    useEffect(() => {
        cargarCurso();
    }, []);

    const normalizarListaCursos = (data) => {
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.results)) return data.results;
        return [];
    };

    const cargarCurso = async () => {
        setCargandoTabla(true);
        try {
            const respuesta = await read();
            setCurso(normalizarListaCursos(respuesta.data));
        } catch (error) {
            console.error("Error al cargar cursos:", error);
            toast.error("Error al obtener los datos del servidor");
        } finally {
            setCargandoTabla(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargandoGuardar(true);
        setErroresBackend({});

        await new Promise(resolve => setTimeout(resolve, 500)); 

        const dataToSend = {
            nombre: formData.nombre,
            codigo: formData.codigo,
            creditos: formData.creditos,
            profesor: formData.profesor,
            cupo_maximo: formData.cupo_maximo,
            estado: formData.estado,
        };

        try {
            if (editandoId) {
                await update(editandoId, dataToSend);
                toast.success("Curso actualizado correctamente");
            } else {
                await create(dataToSend);
                toast.success("Curso registrado exitosamente");
            }

            setFormData({ 
                nombre: '', 
                codigo: '', 
                creditos: '', 
                profesor: '', 
                cupo_maximo: '', 
                estado: 'ABIERTO',
            });
            setEditandoId(null);
            cargarCurso();
            
        } catch (error) {
            console.error("Error al guardar:", error);

            if (error.response && error.response.data) {
                setErroresBackend(error.response.data);
                toast.error("Por favor, corrige los errores en el formulario");
            } else {
                toast.error("Hubo un error de conexión con el servidor");
            }        
        } finally {
            setCargandoGuardar(false);
        }
    };

    const prepararEdicion = (curso) => {
        setFormData({
            nombre: curso.nombre,
            codigo: curso.codigo,
            creditos: curso.creditos,
            profesor: curso.profesor,
            cupo_maximo: curso.cupo_maximo,
            estado: curso.estado,
        });
        setEditandoId(curso.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelarEdicion = () => {
        setEditandoId(null);
        setFormData({ 
            nombre: '', 
            codigo: '', 
            creditos: '', 
            profesor: '', 
            cupo_maximo: '', 
            estado: 'ABIERTO',
        });
        setErroresBackend({});
    };

    const handleEliminar = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este curso?")) {
            const toastId = toast.loading("Eliminando curso..."); 
            try {
                await deleteM(id);
                toast.success("Curso eliminado", { id: toastId });
                cargarCurso(); 
            } catch (error) {
                console.error("Error al eliminar:", error);
                toast.error("Error al eliminar el curso", { id: toastId });
            }
        }
    };

    const cursosFiltrados = (Curso ?? []).filter((curso) => {
        const needle = (filtro ?? '').toLowerCase().trim();
        if (!needle) return true;

        const nombre = (curso?.nombre ?? '').toString().toLowerCase();
        const codigo = (curso?.codigo ?? '').toString().toLowerCase();
        const profesor = (curso?.profesor ?? '').toString().toLowerCase();
        const estado = (curso?.estado ?? '').toString().toLowerCase();
        const creditos = (curso?.creditos ?? '').toString();
        const cupo = (curso?.cupo_maximo ?? '').toString();

        return (
            nombre.includes(needle) ||
            codigo.includes(needle) ||
            profesor.includes(needle) ||
            estado.includes(needle) ||
            creditos.includes(filtro) ||
            cupo.includes(filtro)
        );
    });            

    const barraDeBusqueda = (
        <div className="input-group mb-3" style={{ maxWidth: '300px' }}>
            <input
                type="text"
                className="form-control"
                placeholder="Buscar curso..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
            />
            {filtro && (
                <button className="btn btn-outline-secondary" type="button" onClick={() => setFiltro('')}>
                    ✖
                </button>
            )}
        </div>
    );

    const SpinnerTabla = () => (
        <div className="p-5 text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2 text-muted">Cargando datos...</p>
        </div>
    );

    const columnas = [
        { name: 'Nombre', selector: row => row.nombre, sortable: true },
        { name: 'Código', selector: row => row.codigo, sortable: true },
        { name: 'Créditos', selector: row => row.creditos, sortable: true },
        { name: 'Profesor', selector: row => row.profesor, sortable: true },
        { name: 'Cupo Máximo', selector: row => row.cupo_maximo, sortable: true },
        { name: 'Estado', selector: row => row.estado, sortable: true },
        {
            name: 'Acciones',
            minWidth: '180px',
            cell: row => (
                <div className="d-flex justify-content-center gap-2">
                    <button className="btn btn-warning btn-sm" onClick={() => prepararEdicion(row)} disabled={cargandoTabla}>
                        Editar
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(row.id)} disabled={cargandoTabla}>
                        Eliminar
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <div className="container">
            <Toaster position="top-right" reverseOrder={false} /> 
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
                <div>
                    <h2 className="mb-0">Gestión de Cursos</h2>
                    <div className="text-muted small">Crear, editar, buscar y eliminar cursos</div>
                </div>
                <span className="badge text-bg-light border">
                    Total: {Curso.length}
                </span>
            </div>
            <div className="row">
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">{editandoId ? 'Editar Curso' : 'Crear Curso'}</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Nombre</label>
                                    <input 
                                        type="text" 
                                        name="nombre" 
                                        placeholder="Ej. Introducción a la Programación"
                                        className={`form-control ${erroresBackend.nombre ? 'is-invalid' : ''}`} 
                                        value={formData.nombre} 
                                        onChange={handleChange} 
                                        required 
                                        disabled={cargandoGuardar} 
                                    />
                                    {erroresBackend.nombre && (
                                        <div className="invalid-feedback">
                                            {erroresBackend.nombre.join(', ')}
                                        </div>
                                    )}                              
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Código</label>
                                    <input 
                                        type="text" 
                                        name="codigo" 
                                        placeholder="Ej. CS101" 
                                        className={`form-control ${erroresBackend.codigo ? 'is-invalid' : ''}`} 
                                        value={formData.codigo} 
                                        onChange={handleChange} 
                                        required 
                                        disabled={cargandoGuardar} 
                                    />
                                    {erroresBackend.codigo && (
                                        <div className="invalid-feedback">
                                            {erroresBackend.codigo.join(', ')}
                                        </div>
                                    )}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Créditos</label>
                                    <input 
                                        type="number" 
                                        name="creditos" 
                                        placeholder='Ej. 3'
                                        className={`form-control ${erroresBackend.creditos ? 'is-invalid' : ''}`} 
                                        value={formData.creditos} 
                                        onChange={handleChange} 
                                        required 
                                        disabled={cargandoGuardar} 
                                    />
                                    {erroresBackend.creditos && (
                                        <div className="invalid-feedback">
                                            {erroresBackend.creditos.join(', ')}
                                        </div>
                                    )}                        
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Profesor</label>
                                    <input
                                        type="text"
                                        name="profesor"
                                        placeholder='Ej. Derick Lagunes'
                                        className={`form-control ${erroresBackend.profesor ? 'is-invalid' : ''}`}
                                        value={formData.profesor}
                                        onChange={handleChange}
                                        required
                                        disabled={cargandoGuardar}
                                    />
                                    {erroresBackend.profesor && (
                                        <div className="invalid-feedback">
                                            {erroresBackend.profesor.join(', ')}
                                        </div>
                                    )}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Cupo Máximo</label>
                                    <input
                                        type="number"
                                        name="cupo_maximo"
                                        placeholder='Ej. 30'
                                        className={`form-control ${erroresBackend.cupo_maximo ? 'is-invalid' : ''}`}
                                        value={formData.cupo_maximo}
                                        onChange={handleChange}
                                        required
                                        disabled={cargandoGuardar}
                                    />
                                    {erroresBackend.cupo_maximo && (
                                        <div className="invalid-feedback">
                                            {erroresBackend.cupo_maximo.join(', ')}
                                        </div>
                                    )}
                                </div>
        
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Estado</label>
                                    <select
                                        name="estado"
                                        placeholder='Ej. ABIERTO'
                                        className={`form-control ${erroresBackend.estado ? 'is-invalid' : ''}`}
                                        value={formData.estado}
                                        onChange={handleChange}
                                        required
                                        disabled={cargandoGuardar}
                                    >
                                        <option value="ABIERTO">Abierto</option>
                                        <option value="CERRADO">Cerrado</option>
                                    </select>
                                    {erroresBackend.estado && (
                                        <div className="invalid-feedback">
                                            {erroresBackend.estado.join(', ')}
                                        </div>
                                    )}
                                </div>

                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-success" disabled={cargandoGuardar}>
                                        {cargandoGuardar ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Guardando...
                                            </>
                                        ) : (
                                            editandoId ? 'Actualizar' : 'Guardar'
                                        )}
                                    </button>
                                    {editandoId && (
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary" 
                                            onClick={cancelarEdicion} 
                                            disabled={cargandoGuardar}
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-body p-0 pt-3" style={{ height: 'fit-content' }}>
                            <DataTable
                                title="Lista de Cursos"
                                columns={columnas}
                                data={cursosFiltrados}
                                keyField="id"
                                pagination
                                paginationPerPage={5}
                                highlightOnHover
                                responsive
                                subHeader
                                subHeaderComponent={barraDeBusqueda}
                                subHeaderAlign="right"
                                noDataComponent="No hay cursos que coincidan con la búsqueda"                             
                                progressPending={cargandoTabla}
                                progressComponent={<SpinnerTabla />}
                                persistTableHead
                                dense
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
