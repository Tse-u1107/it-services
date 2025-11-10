import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ServicePage = () => {
  const { id } = useParams();
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    // In real use: fetch or find from your existing data source
    // e.g. call fetchRequest(`/api/service/${id}`)
    setContent(`This is the content for service ID: ${id}`);
  }, [id]);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Service Page: {id}</h1>
      <p className="text-lg">{content}</p>
    </div>
  );
};

export default ServicePage;
