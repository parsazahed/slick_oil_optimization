function solveSlickOil() {
    const TOTAL_DEMAND = 100;

    const wells = {
        W1: { cost: 3, capacity: 20 },
        W2: { cost: 4, capacity: 30 },
        W3: { cost: 6, capacity: 25 },
        W4: { cost: 5, capacity: 15 },
        W5: { cost: 4.5, capacity: 10 },
        W6: { cost: 2.5, capacity: 40 },
    };

    const refineries = {
        R1: { cost: 2, capacity: 40 },
        R2: { cost: 3, capacity: 30 },
        R3: { cost: 4, capacity: 20 },
        R4: { cost: 5, capacity: 30 },
        R5: { cost: 6, capacity: 25 },
    };

    const allowedRoutes = [
        ["W1", "R1"], ["W1", "R2"],
        ["W2", "R1"], ["W2", "R3"],
        ["W3", "R2"], ["W3", "R4"],
        ["W4", "R3"], ["W4", "R5"],
        ["W5", "R4"],
        ["W6", "R1"], ["W6", "R2"], ["W6", "R3"],
    ];

    let routes = allowedRoutes.map(([w, r]) => ({
        well: w,
        refinery: r,
        cost: wells[w].cost + refineries[r].cost
    }));

    routes.sort((a, b) => a.cost - b.cost);

    let remaining = TOTAL_DEMAND;
    let flows = [];

    for (let route of routes) {
        if (remaining <= 0) break;

        let w = route.well;
        let r = route.refinery;

        let amount = Math.min(
            wells[w].capacity,
            refineries[r].capacity,
            remaining
        );

        if (amount > 0) {
            flows.push({
                source: w,
                target: r,
                value: amount,
                cost: route.cost
            });

            wells[w].capacity -= amount;
            refineries[r].capacity -= amount;
            remaining -= amount;
        }
    }

    return flows;
}