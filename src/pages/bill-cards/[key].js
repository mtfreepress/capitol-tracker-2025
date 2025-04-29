import { promises as fs } from 'fs';
import path from 'path';
import BillCard from '../../components/bill/BillCard';
import bills from '../../data/bills.json';

export async function getStaticPaths() {
    const paths = bills.map((bill) => ({
        params: { key: bill.key },
    }));

    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const bill = bills.find((bill) => bill.key === params.key);

    if (!bill) {
        return { notFound: true };
    }


    const actions = await loadBillActions(bill.identifier);

    return {
        props: {
            bill: {
                ...bill,
                actions,
            },
        },
    };
}

async function loadBillActions(billId) {
    try {
      // Normalize bill ID format (e.g., "HB 123" -> "HB-123")
      const normalizedBillId = billId.replace(' ', '-');
      
      // Construct direct path to this specific bill's actions file
      const filePath = path.join(process.cwd(), 'src/data/bills', `${normalizedBillId}-actions.json`);
      
      // Read and parse the file
      const fileContent = await fs.readFile(filePath, 'utf8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error(`Error loading actions for ${billId}:`, error);
      return [];
    }
  }

const Bill = ({ bill }) => {
    if (!bill) return <div>Bill not found</div>;

    return <BillCard bill={bill} />;
};

export default Bill;
