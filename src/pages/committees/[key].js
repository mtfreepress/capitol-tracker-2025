import CommitteePage from '../../components/committee/CommitteePage';
import committees from '../../data/committees.json';
import bills from '../../data/bills.json';


export async function getStaticPaths() {
    return {
        paths: [],
        fallback: false,
    };
}

export async function getStaticProps() {
    return {
        notFound: true,
    };
}

const Committee = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace('/404');
    }, [router]);

    return null;
};

export default Committee;





// TODO: Restore when we fix committees

// export async function getStaticPaths() {
//     const paths = committees.map(committee => ({
//         params: { key: committee.key },
//     }));

//     return { paths, fallback: false };
// }

// export async function getStaticProps() {
//     return {
//         notFound: true,
//     };
// }
// export async function getStaticProps({ params }) {
//     const committee = committees.find(committee => committee.key === params.key);
//     const relevantBills = bills.filter(bill => committee.bills.includes(bill.identifier));

//     return {
//         props: {
//             committee,
//             bills: relevantBills,
//         },
//     };
// }

// const Committee = ({ committee, bills }) => {
//     return <CommitteePage committee={committee} bills={bills} />;
// };

// export default Committee;