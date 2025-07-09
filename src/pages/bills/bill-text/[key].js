import { promises as fs } from 'fs';
import path from 'path';

export async function getStaticPaths() {
    const billTextsPath = path.join(process.cwd(), 'public', 'bill-texts');
    const directories = await fs.readdir(billTextsPath);

    const paths = directories.map(dir => ({
        params: { key: dir.toLowerCase() }
    }));

    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const { key } = params;
    const billDir = key.toUpperCase();
    const billTextsPath = path.join(process.cwd(), 'public', 'bill-texts', billDir);
    const files = await fs.readdir(billTextsPath);

    // Find the first PDF file (assuming only one per bill)
    const fileName = files.find(file => file.endsWith('.pdf'));
    const encodedFileName = encodeURIComponent(fileName);

    const filePath = path.join(process.env.BASE_PATH || '', 'bill-texts', billDir, encodedFileName);

    return {
        props: {
            pdfUrl: `${filePath}`
        }
    };
}

export default function BillTextPage({ pdfUrl }) {
    return (
        <div style={{ width: '100%', height: '100vh', border: 'none' }}>
            <iframe
                src={pdfUrl}
                style={{ width: '100%', height: '100%', border: 'none' }}
                frameBorder="0"
            />
        </div>
    );
}