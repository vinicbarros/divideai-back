import searchRepository from "@/repositories/search-repository";

async function findEmail(email: string) {
  const resultSearch = await searchRepository.searchByEmail(email);

  return resultSearch;
}

const searchService = {
  findEmail,
};

export default searchService;
