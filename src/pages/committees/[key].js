import CommitteePage from '../../components/committee/CommitteePage';
import committees from '../../data/committees.json';
import bills from '../../data/bills.json';

export async function getStaticPaths() {
    const paths = committees.map(committee => ({
        params: { key: committee.key },
    }));

    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const committee = committees.find(committee => committee.key === params.key);
    const relevantBills = bills.filter(bill => committee.bills.includes(bill.identifier));

    return {
        props: {
            committee,
            bills: relevantBills,
        },
    };
}

const Committee = ({ committee, bills }) => {
    return <CommitteePage committee={committee} bills={bills} />;
};

export default Committee;
