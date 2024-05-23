export const API_URL = "https://board-game-plum.vercel.app";
//https://board-game-plum.vercel.app/

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };