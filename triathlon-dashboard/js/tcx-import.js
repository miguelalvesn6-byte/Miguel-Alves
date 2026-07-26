// Parser de ficheiros .tcx (exportados do TrainingPeaks/Garmin/etc.)
// Extrai um resumo do treino: desporto, data, duração, distância, FC média/máxima e ritmo médio.

const SPORT_MAP = { Running: "corrida", Biking: "ciclismo", Swimming: "natacao", Other: "outro" };

function textOf(el, tag) {
  const found = el.getElementsByTagName(tag)[0];
  return found ? found.textContent : null;
}

export function parseTCX(xmlString) {
  const xml = new DOMParser().parseFromString(xmlString, "application/xml");
  if (xml.getElementsByTagName("parsererror").length) {
    throw new Error("Ficheiro TCX inválido ou corrompido.");
  }

  const activity = xml.getElementsByTagName("Activity")[0];
  if (!activity) {
    throw new Error("Não foi encontrada nenhuma atividade neste ficheiro.");
  }

  const sportRaw = activity.getAttribute("Sport") || "Other";
  const sport = SPORT_MAP[sportRaw] || "outro";

  const idText = textOf(activity, "Id");
  const date = idText ? idText.slice(0, 10) : new Date().toISOString().slice(0, 10);

  const laps = Array.from(activity.getElementsByTagName("Lap"));
  if (laps.length === 0) {
    throw new Error("Ficheiro sem dados de treino (nenhum Lap encontrado).");
  }

  let totalTimeSec = 0;
  let totalDistanceM = 0;
  let hrWeightedSum = 0;
  let hrWeight = 0;
  let maxHR = 0;

  for (const lap of laps) {
    const t = parseFloat(textOf(lap, "TotalTimeSeconds") || "0");
    const d = parseFloat(textOf(lap, "DistanceMeters") || "0");
    totalTimeSec += t;
    totalDistanceM += d;

    const avgHrParent = lap.getElementsByTagName("AverageHeartRateBpm")[0];
    if (avgHrParent) {
      const hr = parseFloat(textOf(avgHrParent, "Value") || "0");
      if (hr > 0) {
        hrWeightedSum += hr * t;
        hrWeight += t;
      }
    }
    const maxHrParent = lap.getElementsByTagName("MaximumHeartRateBpm")[0];
    if (maxHrParent) {
      const hr = parseFloat(textOf(maxHrParent, "Value") || "0");
      if (hr > maxHR) maxHR = hr;
    }
  }

  return {
    sport,
    date,
    durationSec: Math.round(totalTimeSec),
    distanceM: Math.round(totalDistanceM),
    avgHR: hrWeight > 0 ? Math.round(hrWeightedSum / hrWeight) : null,
    maxHR: maxHR || null,
    avgPaceSecPerKm: totalDistanceM > 0 ? Math.round(totalTimeSec / (totalDistanceM / 1000)) : null,
  };
}

export function formatDuration(sec) {
  if (sec == null) return "—";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.round(sec % 60);
  return h > 0
    ? `${h}h${String(m).padStart(2, "0")}m`
    : `${m}m${String(s).padStart(2, "0")}s`;
}

export function formatDistance(m) {
  if (m == null) return "—";
  return m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m)} m`;
}

export function formatPace(secPerKm) {
  if (secPerKm == null) return "—";
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${String(s).padStart(2, "0")} /km`;
}
