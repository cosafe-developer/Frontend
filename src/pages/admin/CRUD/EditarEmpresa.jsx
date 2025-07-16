import EditarEmpresa from '../../../components/admin/CRUD/EditarEmpresa';
import { useParams } from 'react-router-dom';

const EditarEmpresaPage = () => {
  const { empresaId } = useParams();

  return <EditarEmpresa empresaId={empresaId} />;
};

export default EditarEmpresaPage;
