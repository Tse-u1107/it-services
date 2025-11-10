import { fetchRequest } from "../api/client/axiosClient";

export default async function Page({ params }: { params: { slug: string } }) {
  const content = await fetchRequest(params.slug);
  return(
    <div>
        {content}
    </div>
  );
}