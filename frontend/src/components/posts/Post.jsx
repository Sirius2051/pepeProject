import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostCard from './PostCard';

const Post = () => {
    const { id } = useParams(); // Extrae el parámetro id correctamente
    const [data, setData] = useState(null); // Inicializa data como null
    const [loading, setLoading] = useState(true); // Estado para manejar la carga
    const [error, setError] = useState(null); // Estado para manejar errores

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetch(`http://localhost:3456/api/posts/${id}`);
                if (!response.ok) {
                    throw new Error('No se pudo cargar el post');
                }
                const datos = await response.json();
                setData(datos);
            } catch (err) {
                setError(err.message); // Maneja errores de la solicitud
            } finally {
                setLoading(false); // Finaliza la carga, independientemente del resultado
            }
        };

        loadData();
    }, [id]);

    if (loading) {
        return <div>Cargando...</div>; // Muestra un mensaje de carga
    }

    if (error) {
        return <div>Error: {error}</div>; // Muestra un mensaje de error
    }

    if (!data) {
        return <div>No se encontró el post</div>; // Maneja el caso en que data es null
    }

    return (
        <>
            <PostCard key={data.id} post={data} />
        </>
    );
};

export default Post;