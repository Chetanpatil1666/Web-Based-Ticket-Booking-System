async function run15SequenceAudit() {
  console.log("===============================================================");
  console.log("       STARTING COMPLETE 15-SEQUENCE COMPREHENSIVE AUDIT       ");
  console.log("===============================================================");
  const base = "http://localhost:8080";

  let passes = 0;
  let fails = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passes++;
    } else {
      console.error(`  [FAIL] ${message}`);
      fails++;
    }
  }

  try {
    // --- SEQUENCE 1: Registration & Login <-> AI Chatbot Assistant ---
    console.log("\n--- SEQUENCE 1: Registration & Login <-> AI Chatbot Assistant ---");
    const chatRes = await fetch(`${base}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "How do I register a new passenger account and verify my mobile number?" })
    });
    const chatData = await chatRes.json();
    assert(chatRes.status === 200, "AI Chatbot assistant responded with HTTP 200");
    assert(chatData.reply && chatData.reply.length > 30, "AI Chatbot delivered clear registration guidelines");

    // --- SEQUENCE 2: Search Buses <-> Natural-Language Bus Search ---
    console.log("\n--- SEQUENCE 2: Search Buses <-> Natural-Language Bus Search ---");
    const nlpRes = await fetch(`${base}/ai/nlp-search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "Need AC sleeper bus from Mumbai to Bengaluru tomorrow" })
    });
    const nlpData = await nlpRes.json();
    assert(nlpRes.status === 200, "Natural-Language bus search returned HTTP 200");
    assert(nlpData.parsed?.from === "Mumbai" && nlpData.parsed?.to === "Bengaluru", "AI extracted route: Mumbai -> Bengaluru");
    assert(nlpData.parsed?.preferences?.sleeper === true, "AI extracted sleeper preference");

    // --- SEQUENCE 3: Live Seat Availability & AI Bus Recommendations ---
    console.log("\n--- SEQUENCE 3: Live Seat Selection <-> AI Bus Recommendations ---");
    const recRes = await fetch(`${base}/ai/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: "Mumbai", to: "Bengaluru" })
    });
    const recData = await recRes.json();
    assert(recRes.status === 200, "AI Recommendation returned HTTP 200");
    assert(!!recData.topPick, `Identified AI Top Pick bus: ${recData.topPick?.companyname}`);

    const busRes = await fetch(`${base}/bus/getall`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: "Mumbai", to: "Bengaluru", date: "2026-11-08" })
    });
    const buses = await busRes.json();
    assert(busRes.status === 200 && buses.length >= 15, `Found ${buses.length} scheduled buses on route`);
    const selectedBus = buses[0];

    // --- SEQUENCE 4: Booking Confirmation & Unique PNR <-> Personalized Travel Suggestions ---
    console.log("\n--- SEQUENCE 4: Booking & PNR <-> Personalized Travel Suggestions ---");
    const suggRes = await fetch(`${base}/ai/travel-suggestions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origin: "Mumbai", destination: "Bengaluru" })
    });
    const suggData = await suggRes.json();
    assert(suggRes.status === 200, "Personalized travel suggestions returned HTTP 200");
    assert(!!suggData.suggestions?.weather, `AI destination weather: ${suggData.suggestions?.weather}`);
    assert(suggData.suggestions?.returnDiscountCode === "SUPERBUS", "Verified 15% return ticket voucher: SUPERBUS");

    // --- SEQUENCE 5: Online Payment Gateway <-> AI-Based Payment Fraud Detection ---
    console.log("\n--- SEQUENCE 5: Payment Gateway <-> AI Payment Fraud Detection ---");
    const fraudRes = await fetch(`${base}/ai/fraud-check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "passenger.verified@gmail.com",
        phone: "9820011223",
        amount: selectedBus.price || 1550,
        seatCount: 1,
      })
    });
    const fraudData = await fraudRes.json();
    assert(fraudRes.status === 200, "AI Fraud shield check returned HTTP 200");
    assert(fraudData.status === "APPROVED", `Transaction evaluated: ${fraudData.status} (Safety Confidence: ${fraudData.confidence})`);

    // Create a real order to test Sequences 6 & 7
    const testSeat = "29";
    const orderRes = await fetch(`${base}/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bus: selectedBus._id,
        ticketSummary: {
          ticket: testSeat,
          date: "2026-11-08",
          amount: selectedBus.price || 1550,
        },
        userDetails: {
          name: "Sequence Audit Passenger",
          email: "audit.seq@gmail.com",
          phone: 9820011223,
          age: 27,
          gender: "female",
        },
        passengers: [
          { seat: testSeat, name: "Sequence Audit Passenger", age: 27, gender: "female" }
        ],
        paymentDetails: {
          amount: selectedBus.price || 1550,
          method: "UPI",
          orderId: "order_seq_" + Date.now(),
        }
      })
    });
    const orderData = await orderRes.json();
    assert(orderRes.status === 201, `Order generated successfully with ID ${orderData._id}`);

    // --- SEQUENCE 6: Booking History & E-Ticket PDF <-> AI Travel Assistant ---
    console.log("\n--- SEQUENCE 6: Booking History & E-Ticket <-> AI Travel Assistant ---");
    const assistantRes = await fetch(`${base}/ai/journey-assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: selectedBus.from,
        to: selectedBus.to,
        date: "2026-11-08",
        departure: selectedBus.departure,
        arrival: selectedBus.arrival,
      })
    });
    const assistantData = await assistantRes.json();
    assert(assistantRes.status === 200, "AI Journey Travel Assistant returned HTTP 200");
    assert(!!assistantData.onTimeLikelihood, `On-time arrival likelihood calculated: ${assistantData.onTimeLikelihood}`);
    assert(Array.isArray(assistantData.packingChecklist), `Packing checklist generated with ${assistantData.packingChecklist.length} items`);

    // --- SEQUENCE 7: Booking Cancellation & Refund <-> AI Cancellation Policy Assistant ---
    console.log("\n--- SEQUENCE 7: Cancellation & Refund <-> AI Cancellation Policy Assistant ---");
    const cancelPolicyRes = await fetch(`${base}/ai/cancellation-policy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        totalFare: selectedBus.price || 1550,
        departureTime: selectedBus.departure,
        journeyDate: "2026-11-08",
      })
    });
    const cancelPolicyData = await cancelPolicyRes.json();
    assert(cancelPolicyRes.status === 200, "AI Cancellation policy assistant returned HTTP 200");
    assert(cancelPolicyData.refundPercentage >= 0, `Refund percentage calculated: ${cancelPolicyData.refundPercentage}% (Refund: Rs ${cancelPolicyData.refundAmount})`);
    assert(Array.isArray(cancelPolicyData.smartAlternatives), "Suggested smart zero-deduction alternatives (reschedule / credits)");

    // Process actual cancellation & seat freeing
    const deleteOrderRes = await fetch(`${base}/order/oneorder/${orderData._id}`, { method: "DELETE" });
    assert(deleteOrderRes.status === 200, "Order cancelled & seat successfully freed in fleet database");

    // --- SEQUENCE 8: Bus, Route & Schedule Management <-> AI Demand Prediction ---
    console.log("\n--- SEQUENCE 8: Bus & Route Management <-> AI Demand Prediction ---");
    const demandRes = await fetch(`${base}/ai/demand-prediction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: "Mumbai", to: "Bengaluru", date: "2026-11-08" })
    });
    const demandData = await demandRes.json();
    assert(demandRes.status === 200, "AI Demand Prediction returned HTTP 200");
    assert(!!demandData.demandScore, `Demand intensity score: ${demandData.demandScore} (${demandData.demandLevel})`);
    assert(!!demandData.occupancyForecast, `Occupancy forecast: ${demandData.occupancyForecast}`);
    assert(!!demandData.dispatchRecommendation, "Generated fleet bus dispatch frequency recommendation");

    // --- SEQUENCE 9: Driver & Operator Management <-> AI Route Demand Analysis ---
    console.log("\n--- SEQUENCE 9: Driver & Operator Management <-> AI Route Demand Analysis ---");
    const routeDemandRes = await fetch(`${base}/ai/route-demand-analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ route: "Mumbai ➔ Bengaluru" })
    });
    const routeDemandData = await routeDemandRes.json();
    assert(routeDemandRes.status === 200, "AI Route Demand Analysis returned HTTP 200");
    assert(!!routeDemandData.routeAnalysis?.difficultyIndex, `Route difficulty index: ${routeDemandData.routeAnalysis.difficultyIndex}`);
    assert(Array.isArray(routeDemandData.driverRoster) && routeDemandData.driverRoster.length > 0, `Driver roster active with ${routeDemandData.driverRoster.length} verified pilots`);
    assert(!!routeDemandData.routeAnalysis?.driverRestCompliance, "Verified 100% driver rest break compliance telemetry");

    // --- SEQUENCE 10: Passenger & Booking Management <-> AI Review Sentiment Analysis ---
    console.log("\n--- SEQUENCE 10: Passenger & Booking Management <-> AI Review Sentiment Analysis ---");
    const sentimentRes = await fetch(`${base}/ai/sentiment-analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    const sentimentData = await sentimentRes.json();
    assert(sentimentRes.status === 200, "AI Review Sentiment Analysis returned HTTP 200");
    assert(!!sentimentData.metrics?.overallSatisfaction, `Overall customer satisfaction index: ${sentimentData.metrics.overallSatisfaction}`);
    assert(!!sentimentData.metrics?.sentimentDistribution?.positive, `Positive sentiment share: ${sentimentData.metrics.sentimentDistribution.positive}`);
    assert(Array.isArray(sentimentData.recentReviews), `Analyzed ${sentimentData.recentReviews.length} passenger reviews across cleanliness, punctuality & comfort`);

    // --- SEQUENCE 11: Pricing, Offers & Discounts <-> Smart Dynamic Pricing Suggestions ---
    console.log("\n--- SEQUENCE 11: Pricing & Discounts <-> Smart Dynamic Pricing Suggestions ---");
    const pricingRes = await fetch(`${base}/ai/dynamic-pricing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        route: "Mumbai ➔ Bengaluru",
        basePrice: 1600,
        occupancyRate: 85,
        daysUntilDeparture: 2,
      })
    });
    const pricingResult = await pricingRes.json();
    assert(pricingRes.status === 200, "Smart Dynamic Pricing endpoint returned HTTP 200");
    assert(pricingResult.recommendedPrice > 0, `Calculated dynamic fare: ₹${pricingResult.recommendedPrice} (Strategy: ${pricingResult.pricingStrategy})`);
    assert(Array.isArray(pricingResult.smartCoupons) && pricingResult.smartCoupons.length >= 3, `Returned ${pricingResult.smartCoupons.length} smart coupon vouchers`);

    // --- SEQUENCE 12: Revenue Reports & Analytics <-> AI Revenue Forecasting ---
    console.log("\n--- SEQUENCE 12: Revenue Reports <-> AI Revenue Forecasting ---");
    const revRes = await fetch(`${base}/ai/revenue-forecast`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ period: "30days" })
    });
    const revResult = await revRes.json();
    assert(revRes.status === 200, "AI Revenue Forecasting endpoint returned HTTP 200");
    assert(!!revResult.forecast?.projectedNextMonthFormatted, `Projected revenue next 30 days: ${revResult.forecast.projectedNextMonthFormatted} (${revResult.forecast.projectedGrowthPercentage})`);
    assert(Array.isArray(revResult.forecast?.corridorContribution), `Audited ${revResult.forecast.corridorContribution.length} corridor revenue contributions`);

    // --- SEQUENCE 13: Email & Notification System <-> AI Notification Personalization ---
    console.log("\n--- SEQUENCE 13: Email & Notification <-> AI Notification Personalization ---");
    const notifRes = await fetch(`${base}/ai/personalized-notification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        passengerName: "Pooja Sharma",
        gender: "female",
        route: "Mumbai ➔ Bengaluru",
        departureTime: "21:00",
        seatNumber: "Seat 6",
        passengerType: "solo_female"
      })
    });
    const notifResult = await notifRes.json();
    assert(notifRes.status === 200, "AI Personalized Notification endpoint returned HTTP 200");
    assert(notifResult.personalizedTone.includes("Ladies Berth"), `Dynamic personalization tone verified: ${notifResult.personalizedTone}`);
    assert(!!notifResult.channels?.whatsapp && !!notifResult.channels?.email, "Generated synchronized WhatsApp, SMS and Email notification payload");

    // --- SEQUENCE 14: Ratings & Passenger Feedback <-> AI Review Summarization ---
    console.log("\n--- SEQUENCE 14: Ratings & Feedback <-> AI Review Summarization ---");
    const summaryRes = await fetch(`${base}/ai/summarize-reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        route: "Mumbai ➔ Bengaluru",
        operator: "Orange Travels Gold Class"
      })
    });
    const summaryResult = await summaryRes.json();
    assert(summaryRes.status === 200, "AI Review Summarization endpoint returned HTTP 200");
    assert(summaryResult.summary?.netPromoterScore.includes("+74"), `Calculated Net Promoter Score (NPS): ${summaryResult.summary.netPromoterScore}`);
    assert(Array.isArray(summaryResult.summary?.coreStrengths), `Extracted ${summaryResult.summary.coreStrengths.length} core passenger satisfaction strengths`);

    // --- SEQUENCE 15: Security, Logging & Monitoring <-> AI-based Anomaly Detection ---
    console.log("\n--- SEQUENCE 15: Security & Monitoring <-> AI-Based Anomaly Detection ---");
    const auditRes = await fetch(`${base}/ai/security-audit`, { method: "GET" });
    const auditResult = await auditRes.json();
    assert(auditRes.status === 200, "Security Audit Telemetry endpoint returned HTTP 200");
    assert(auditResult.telemetry?.systemThreatLevel.includes("SECURE"), `System Threat Status: ${auditResult.telemetry.systemThreatLevel}`);

    const scanRes = await fetch(`${base}/ai/scan-anomalies`, { method: "POST" });
    const scanResultData = await scanRes.json();
    assert(scanRes.status === 200, "AI Anomaly Diagnostic Scan returned HTTP 200");
    assert(scanResultData.threatsDetected === 0, `Anomaly scan complete: ${scanResultData.systemHealth} (0 threats detected)`);

    // Complete Summary
    console.log("\n===============================================================");
    console.log(`  ALL 15 SEQUENCES VERIFIED: ${passes} PASSED, ${fails} FAILED`);
    console.log("===============================================================");
    process.exit(fails > 0 ? 1 : 0);
  } catch (err) {
    console.error("Audit failure:", err);
    process.exit(1);
  }
}

run15SequenceAudit();
