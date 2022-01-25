import { useEffect, useState } from "react";

export const getUser = async (sub: string) => {
  const user = await fetch(`/api/user/${sub}`).catch((e) => console.log(e));
  return user ? user.json() : user;
};

export const getUserCount = async (): Promise<number | undefined> => {
  const count = await fetch(`/api/user-count`).catch((e) => console.log(e));
  return count ? count.json() : count;
};

export const useUserCount = () => {
  const [count, setCount] = useState<number>();

  useEffect(() => {
    getUserCount().then((res) => setCount(res));
  }, []);

  return count;
};
