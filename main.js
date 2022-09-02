import countries from "./countries.json";
import { toast } from "https://cdn.skypack.dev/wc-toast";
//una funcition para selecionar mas facil los elementos
const $ = (selector) => document.querySelector(selector);

//TODO: // seleccionado a traves de una variable
const $textarea = $("textarea");

//transformamos la hora
function changesTimeZone(date, timeZone) {
  const dateToUse = typeof date === "string" ? new Date(date) : date;

  return new Date(
    dateToUse.toLocaleString("en-US", {
      timeZone,
    })
  );
}

// la convertimos en string
const transformDateToString = (date) => {
  const localDate = date.toLocaleString("es-ES", {
    hours12: false,
    hour: "numeric",
    minute: "numeric",
  });
  return localDate + "H";
};

//TODO: // seleccionado directamente
$("form").addEventListener("submit", (event) => {
  //prevenimos la recarga de la pagina por el submit
  event.preventDefault();
  //convertimos en un solo objeto la data
  const { date } = Object.fromEntries(new window.FormData(event.target));

  const mainDate = new Date(date);
  const times = {};
  //recoremos el json y extraemos lo que necesitamos de el
  countries.forEach((country) => {
    const { country_code: code, emoji, timezones } = country;
    const [timezone] = timezones;
    const dateInTimezone = changesTimeZone(mainDate, timezone);
    const hours = dateInTimezone.getHours();

    //pusheamos dependiendo de la hora
    times[hours] ??= [];
    times[hours].push({
      date: dateInTimezone,
      emoji,
      code,
      timezones,
    });
  });
  //ordenamos deacuerdo a la hora
  const sortedTimes = Object.entries(times).sort(
    ([timeA], [timeB]) => timeA - +timeB
  );

  const html = sortedTimes
    .map(([, countries]) => {
      const flags = countries.map((country) => `${country.emoji}`).join(" ");
      const [country] = countries;
      const { date } = country;

      return `${transformDateToString(date)} ${flags}`;
    })
    .join("\n");

  //copiamos al portapapeles y mostramos un toast
  navigator.clipboard.writeText(html).then(() => {
    toast("copiado en el portapapeles", {
      icon: {
        type: "success",
      },
    });
  });

  $textarea.value = html;
});
