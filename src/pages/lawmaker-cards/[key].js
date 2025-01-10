import { fetchLawmakerData, fetchPortraitImage, fetchLawmakerPaths } from '@/lib/lawmaker';
import LawmakerCard from '../../components/lawmaker/LawmakerCard';

export async function getStaticPaths() {
    const paths = fetchLawmakerPaths();
    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    try {
        const lawmaker = fetchLawmakerData(params.key);
        const portrait = lawmaker.portrait
            ? fetchPortraitImage(lawmaker.portrait)
            : null;

        return {
            props: {
                lawmaker: {
                    ...lawmaker,
                    portrait,
                },
            },
        };
    } catch (error) {
        console.error(error);
        return { notFound: true };
    }
}

const Lawmaker = ({ lawmaker }) => {
    console.log(lawmaker)
    if (!lawmaker) {
        return <div>Lawmaker not found</div>;
    }

    return <LawmakerCard lawmaker={lawmaker} portrait={lawmaker.portrait} />;
};

export default Lawmaker;
