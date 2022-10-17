import { getSession } from "next-auth/react";
import Layout from "@/components/Layout";
import Grid from "@/components/Grid";
import { prisma } from "@/lib/prisma";

export async function getServerSideProps(context) {
  // Check if user is authenticated
  const session = await getSession(context);

  // If not, redirect to the homepage
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const favoriteHomes = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      home: true,
    },
  });

  // Pass the data to the Homes component
  return {
    props: {
      homes: JSON.parse(
        JSON.stringify(favoriteHomes.map((favorite) => favorite.home))
      ),
    },
  };
}

const Favorites = ({ homes = [] }) => {
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">Your Favorites</h1>
      <p className="text-gray-500">
        Manage your homes and update your favorites
      </p>
      <div className="mt-8">
        <Grid homes={homes} />
      </div>
    </Layout>
  );
};

export default Favorites;
