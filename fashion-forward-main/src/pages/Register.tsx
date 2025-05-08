
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import RegisterForm from '@/components/auth/RegisterForm';

const Register = () => {
  const { isAuthenticated } = useAuth();

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <RegisterForm />
      </div>
    </Layout>
  );
};

export default Register;
