import { promises as fs } from 'fs';
import path from 'path';

export async function getStaticPaths() {
    const fiscalNotesPath = path.join(process.cwd(), 'public', 'fiscal-notes');
    const directories = await fs.readdir(fiscalNotesPath);
    
    const paths = directories.map(dir => ({
        params: { key: dir.toLowerCase() }
    }));

    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const { key } = params;
    const billDir = key.toUpperCase();
    const billType = billDir.slice(0, 2);
    const billNumber = billDir.slice(3).padStart(4, '0');
    const fileName = `${billType}${billNumber}.pdf`;
    const filePath = path.join(process.env.BASE_PATH || '', 'fiscal-notes', billDir, fileName);
    
    return {
        props: {
            pdfUrl: `${filePath}`
        }
    };
}

export default function FiscalNotePage({ pdfUrl }) {
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