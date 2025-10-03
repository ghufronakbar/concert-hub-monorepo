const formatDate = (dateString) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const date = new Date(dateString);

  const dayName = days[date.getUTCDay()];
  const day = date.getUTCDate();
  const monthName = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  return `${dayName}, ${day} ${monthName} ${year}`;
}


const formatTime = (dateString) => {
  const date = new Date(dateString);

  const hour = date.getUTCHours()
  const minute = date.getUTCMinutes()
  const seconds = date.getUTCSeconds()

  return `${hour}:${minute}:${seconds}`;
}

module.exports = { formatDate, formatTime }