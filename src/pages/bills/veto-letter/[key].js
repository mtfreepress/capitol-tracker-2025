import { promises as fs } from 'fs';
import path from 'path';

export async function getStaticPaths() {
    const vetoLettersPath = path.join(process.cwd(), 'public', 'veto-letters');
    const directories = await fs.readdir(vetoLettersPath);

    const paths = directories.map(dir => ({
        params: { key: dir.toLowerCase() }
    }));

    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const { key } = params;
    const billDir = key.toUpperCase();
    const vetoLettersPath = path.join(process.cwd(), 'public', 'veto-letters', billDir);
    const files = await fs.readdir(vetoLettersPath);

    // Find the first PDF file (assuming only one per bill)
    const fileName = files.find(file => file.endsWith('.pdf'));
    const encodedFileName = encodeURIComponent(fileName);

    const filePath = path.join(process.env.BASE_PATH || '', 'veto-letters', billDir, encodedFileName);

    return {
        props: {
            pdfUrl: `${filePath}`
        }
    };
}

export default function VetoLetterPage({ pdfUrl }) {
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