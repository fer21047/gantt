import React, { useCallback, useEffect } from "react";

import GSTC from "gantt-schedule-timeline-calendar/dist/gstc.wasm.esm.min.js";
import { Plugin as TimelinePointer } from "gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js";
import { Plugin as Selection } from "gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js";
import { Plugin as ItemResizing } from "gantt-schedule-timeline-calendar/dist/plugins/item-resizing.esm.min.js";
import { Plugin as ItemMovement } from "gantt-schedule-timeline-calendar/dist/plugins/item-movement.esm.min.js";

import "gantt-schedule-timeline-calendar/dist/style.css";
import "./App.css";

let gstc, state;

// helper functions

function generateRows() {
  /**
   * @type { import("gantt-schedule-timeline-calendar").Rows }
   */
  const rows = {};
  for (let i = 0; i < 100; i++) {
    const id = GSTC.api.GSTCID(i.toString());
    rows[id] = {
      id,
      label: `Row ${i}`,
    };
  }
  return rows;
}

function generateItems() {
  /**
   * @type { import("gantt-schedule-timeline-calendar").Items }
   */
  const items = {};
  // @ts-ignore
  let start = GSTC.api.date().startOf("day").subtract(6, "day");
  for (let i = 0; i < 100; i++) {
    const id = GSTC.api.GSTCID(i.toString());
    const rowId = GSTC.api.GSTCID(Math.floor(Math.random() * 100).toString());
    start = start.add(1, "day");
    items[id] = {
      id,
      label: `Item ${i}`,
      rowId,
      time: {
        start: start.valueOf(),
        end: start.add(1, "day").endOf("day").valueOf(),
      },
    };
  }
  return items;
}

function initializeGSTC(element) {
  /**
   * @type { import("gantt-schedule-timeline-calendar").Config }
   */
  const config = {
    licenseKey:
    "====BEGIN LICENSE KEY====\nn8dujOwD1BFeGNF4bMJsr+PykNPg1NJefLJ+xcj8sIEXuqYZG/V0XxbW0ynJThxD3REi3EATh/OD/lna5QHL77uAWPlBwnyM4yIw5WXnXtlORhAptvs48leGgG3LInHS6lLQ2VDQZGTJHPjM7ztSZYfFS+T3wThlofWmVlFvVDkhIXmfF4TYqoeck3spKP0Y27DxLqmQP5AELNE12cDySVzuS2a0D/2OnQ+s4zSX7REwi/X/C6OiUYxGqPbZ7vMHhUJ/8J/cqo3MC540OUjA1ea3W2Uoc3yucsz6WHQpkNcHOIgEfkVTu2peQYxoFNV07xyFFk0e3Hx4H3W/7u6b5w==||U2FsdGVkX1/DUN3VqpHv4oEzdor/lT/FMUPOKJCOMZEod3LwEEPlTG0baksfKMnBKwC2Nup6kLyXRRwBAMdzFMNQufBFemennh9J8L+BuhA=\nX5V1O0Mwp1wZBMx/TSgIRExgtHL2DW0XPUvQCxhGDjrvczTyaW6xHZ/TU/ph7/BAfUED7o8HE268KXxE08xlk/V/vR+h56auCtS0j4NnOaOG2VOe8Yl+FCKxto8+MpU0DcL9d8SUD7W1bNMTHej3LwX6d5uM9t7IFfg9513/iJ/GwHWLwIompsM5OR7+SvKfJM6+DdJ2pnJtAKo0PX80Bh87znmPR7yVJcZ6+RavrVc1h3yuAf7QzP1xGtdF3fhnd01T3cOa74w1EGdQIl0yntMLoDgwAuc1jtDfI9R1C8MnzaaD+tnKo9S18AVsSY8Pj3G4jE/iNU4CHI9PQigz7g==\n====END LICENSE KEY====",
    plugins: [TimelinePointer(), Selection(), ItemResizing(), ItemMovement()],
    list: {
      columns: {
        data: {
          [GSTC.api.GSTCID("id")]: {
            id: GSTC.api.GSTCID("id"),
            width: 60,
            data: ({ row }) => GSTC.api.sourceID(row.id),
            header: {
              content: "ID",
            },
          },
          [GSTC.api.GSTCID("label")]: {
            id: GSTC.api.GSTCID("label"),
            width: 200,
            data: "label",
            header: {
              content: "Label",
            },
          },
        },
      },
      rows: generateRows(),
    },
    chart: {
      items: generateItems(),
    },
  };

  state = GSTC.api.stateFromConfig(config);

  gstc = GSTC({
    element,
    state,
  });
}

function App() {
  const callback = useCallback((element) => {
    if (element) initializeGSTC(element);
  }, []);

  useEffect(() => {
    return () => {
      if (gstc) {
        gstc.destroy();
      }
    };
  });

  function updateFirstRow() {
    state.update(`config.list.rows.${GSTC.api.GSTCID("0")}`, (row) => {
      row.label = "Changed dynamically";
      return row;
    });
  }

  function changeZoomLevel() {
    state.update("config.chart.time.zoom", 21);
  }

  return (
    <div className="App">
      <div className="toolbox">
        <button onClick={updateFirstRow}>Actualizar la primera fila</button>
        <button onClick={changeZoomLevel}>Cambiar el nivel de zoom</button>
      </div>
      <div className="gstc-wrapper" ref={callback}></div>
    </div>
  );
}

export default App;
