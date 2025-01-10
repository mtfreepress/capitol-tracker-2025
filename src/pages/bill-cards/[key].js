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
    const dataDir = path.join(process.cwd(), 'src/data');
    const files = await fs.readdir(dataDir);
    const actionFiles = files.filter(
        (file) => file.startsWith('bill-actions-') && file.endsWith('.json')
    );

    let allActions = [];

    for (const file of actionFiles) {
        const filePath = path.join(dataDir, file);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const actionsChunk = JSON.parse(fileContent);
        const billActions = actionsChunk.find((item) => item.bill === billId);
        if (billActions) {
            allActions = billActions.actions;
            break;
        }
    }

    return allActions;
}

const Bill = ({ bill }) => {
    if (!bill) return <div>Bill not found</div>;

    return <BillCard bill={bill} />;
};

export default Bill;
