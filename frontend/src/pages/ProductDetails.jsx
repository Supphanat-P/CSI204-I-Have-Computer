import { useParams } from 'react-router-dom';

export default function ProductDetails() {
    const { id } = useParams();

    return (
        <>
            <div>
                <h1>Viewing Product ID: {id}</h1>
            </div>
        </>
    )
}

//ตัสทำหน้านี้