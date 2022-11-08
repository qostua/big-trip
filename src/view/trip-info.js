export const createTripInfoTemplate = (cities, dateRangeString) => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${cities.join(' &mdash; ')}</h1>

      <p class="trip-info__dates">${dateRangeString}</p>
    </div>
  </section>`
);
