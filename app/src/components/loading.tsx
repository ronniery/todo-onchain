import { ReactNode } from 'react';

type LoadingProps = {
  loading: boolean;
  children: ReactNode;
};

const Loading = ({ loading, children }: LoadingProps): JSX.Element => {
  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
};

export default Loading;
