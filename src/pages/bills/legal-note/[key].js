import { promises as fs } from 'fs';
import path from 'path';

export async function getStaticPaths() {
    const legalNotesPath = path.join(process.cwd(), 'public', 'legal-notes');
    const directories = await fs.readdir(legalNotesPath);
    
    const paths = directories.map(dir => ({
        params: { key: dir.toLowerCase() }
    }));

    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const { key } = params;
    const billDir = key.toUpperCase();
    const billNumber = billDir.replace('-', '0');
    const fileName = encodeURIComponent(`${billNumber} Legal Review Note.pdf`);
    const filePath = path.join(process.env.BASE_PATH || '', 'legal-notes', billDir, fileName);
    
    return {
        props: {
            pdfUrl: `${filePath}`
        }
    };
}

export default function LegalNotePage({ pdfUrl }) {
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