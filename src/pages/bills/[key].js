import { promises as fs } from 'fs';
import path from 'path';
import BillPage from '../../components/bill/BillPage';
import bills from '../../data/bills.json'

export async function getStaticPaths() {
    const paths = bills.map(bill => ({
        params: { key: bill.key },
    }));

    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const bill = bills.find(bill => bill.key === params.key);
    
    if (!bill) {
        return { notFound: true };
    }

    const actions = await loadBillActions(bill.identifier);

    return { 
        props: { 
            bill: {
                ...bill,
                actions: actions
            } 
        } 
    };
}

// for new indivudual bill-actions
async function loadBillActions(billId) {
  try {
    const normalizedBillId = billId.replace(' ', '-');
    const filePath = path.join(process.cwd(), 'src/data/bills', `${normalizedBillId}-actions.json`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error loading actions for ${billId}:`, error);
    return [];
  }
}

const Bill = ({ bill }) => {
    if (!bill) return <div>Bill not found</div>;

    return <BillPage bill={bill} />;
};

export default Bill;