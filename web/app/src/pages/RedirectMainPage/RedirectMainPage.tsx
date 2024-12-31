import { Navigate, useParams } from 'react-router-dom';

export const RedirectMainPage = () => {
  const { boreId } = useParams<{ boreId?: string }>();

  return <Navigate to={`/${boreId}/table`} replace />;
};
