import CommitteePage from '../../components/committee/CommitteePage';
import committees from '../../data/committees.json';
import bills from '../../data/bills.json';

export async function getStaticPaths() {
    const paths = committees.map(committee => ({
        params: { key: committee.key },
    }));

    return { paths, fallback: false };
}

const normalizeBillId = (id) => {
    if (!id) return '';
    return id.replace(/\s+|-/g, '').toUpperCase();
  };

export async function getStaticProps({ params }) {
    const committee = committees.find(committee => committee.key === params.key);
    // Use a Set for O(1) membership checks instead of O(n) array.includes()
    const normalizedCommitteeBillsSet = new Set(committee.bills.map(normalizeBillId));
    const relevantBills = bills.filter(bill =>
        normalizedCommitteeBillsSet.has(normalizeBillId(bill.identifier))
    );

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