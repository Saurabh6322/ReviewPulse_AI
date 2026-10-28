/**
 * ReviewPulse AI - Preview Dataset & Metrics
 * 
 * IMPORTANT: All metrics here are clearly flagged as PREVIEW DATA for UI development
 * until the Flask REST backend + ML inference engine is wired.
 */

export const DATASET_META = {
  name: "Amazon Customer Reviews (Electronics & Consumer Goods)",
  totalReviews: 42740,
  positiveReviews: 17923,
  positivePercent: 41.9,
  neutralReviews: 10468,
  neutralPercent: 24.5,
  negativeReviews: 14349,
  negativePercent: 33.6,
  averageRating: 3.25,
  vocabularySize: 10000,
  datasetSource: "Amazon Customer Feedback Dataset (Deduplicated)",
  sparkPartitions: 16,
  sparkThroughput: "18,450 records/sec",
  lastBatchSync: "Just now",
  isMockData: true,
  dataNotice: "PREVIEW DATA • SIMULATED PIPELINE BENCHMARKS"
};

export const MODEL_BENCHMARKS = [
  {
    id: "linear_svm",
    name: "Linear SVM",
    pipeline: "TF-IDF (5,000 max features) + Linear Support Vector Classifier",
    accuracy: 94.85,
    precision: 95.10,
    recall: 94.85,
    f1Score: 94.97,
    trainingTime: "24.6s",
    inferenceLatencyMs: 4.2,
    status: "Production Ready",
    color: "#22D3EE",
    isBest: false
  },
  {
    id: "random_forest",
    name: "Random Forest",
    pipeline: "TF-IDF + 150 Decision Trees (max_depth=None, min_samples_split=5)",
    accuracy: 94.12,
    precision: 94.80,
    recall: 94.12,
    f1Score: 94.46,
    trainingTime: "1m 18s",
    inferenceLatencyMs: 12.8,
    status: "Active Baseline",
    color: "#8B5CF6",
    isBest: false
  },
  {
    id: "pyspark_mllib",
    name: "PySpark MLlib (Distributed)",
    pipeline: "Spark HashingTF + IDF + Distributed Logistic/Linear Ensemble",
    accuracy: 95.30,
    precision: 95.60,
    recall: 95.30,
    f1Score: 95.45,
    trainingTime: "42.0s (4 Nodes)",
    inferenceLatencyMs: 6.5,
    status: "Cluster Deployed",
    color: "#34D399",
    isBest: true
  }
];

export const CONFUSION_MATRICES = {
  linear_svm: {
    modelName: "Linear SVM",
    labels: ["Negative", "Neutral", "Positive"],
    matrix: [
      [2730, 92, 48],    // True Negative
      [84, 1920, 90],    // True Neutral
      [36, 91, 3457]     // True Positive
    ],
    totalTestSamples: 8548
  },
  random_forest: {
    modelName: "Random Forest",
    labels: ["Negative", "Neutral", "Positive"],
    matrix: [
      [2685, 122, 63],
      [110, 1874, 110],
      [49, 98, 3437]
    ],
    totalTestSamples: 8548
  },
  pyspark: {
    modelName: "PySpark Distributed",
    labels: ["Negative", "Neutral", "Positive"],
    matrix: [
      [2750, 78, 42],
      [75, 1945, 74],
      [31, 82, 3471]
    ],
    totalTestSamples: 8548
  }
};

export const TOP_WORDS_DATA = {
  positive: [
    { word: "quality", count: 5301, polarity: 0.92, category: "Product Feature" },
    { word: "experience", count: 5120, polarity: 0.88, category: "Experience" },
    { word: "great", count: 4791, polarity: 0.95, category: "Sentiment" },
    { word: "fast", count: 3204, polarity: 0.89, category: "Delivery" },
    { word: "excellent", count: 2850, polarity: 0.96, category: "Sentiment" },
    { word: "happy", count: 2610, polarity: 0.91, category: "Emotion" },
    { word: "recommended", count: 2540, polarity: 0.93, category: "Endorsement" },
    { word: "easy", count: 2315, polarity: 0.87, category: "Usability" },
    { word: "perfect", count: 2190, polarity: 0.94, category: "Sentiment" },
    { word: "love", count: 2050, polarity: 0.97, category: "Emotion" },
    { word: "sound", count: 1890, polarity: 0.76, category: "Product Feature" },
    { word: "battery", count: 1740, polarity: 0.72, category: "Hardware" }
  ],
  negative: [
    { word: "not", count: 26060, polarity: -0.85, category: "Negation" },
    { word: "customer", count: 10561, polarity: -0.68, category: "Support" },
    { word: "service", count: 9157, polarity: -0.65, category: "Support" },
    { word: "refund", count: 4890, polarity: -0.96, category: "Billing" },
    { word: "broken", count: 3740, polarity: -0.94, category: "Defect" },
    { word: "never", count: 3650, polarity: -0.88, category: "Negation" },
    { word: "delayed", count: 3120, polarity: -0.90, category: "Delivery" },
    { word: "worst", count: 2890, polarity: -0.98, category: "Sentiment" },
    { word: "waste", count: 2750, polarity: -0.95, category: "Value" },
    { word: "poor", count: 2610, polarity: -0.92, category: "Quality" },
    { word: "return", count: 2480, polarity: -0.84, category: "Logistics" },
    { word: "problem", count: 2390, polarity: -0.86, category: "Issue" }
  ]
};

export const RECENT_REVIEWS_SAMPLE = [
  {
    id: "REV-10492",
    reviewer: "Jessica Vance",
    product: "Wireless Noise Cancelling Headphones",
    rating: 5,
    sentiment: "Positive",
    confidence: 0.984,
    date: "2026-10-18",
    country: "US",
    text: "The audio separation and active noise cancellation are simply marvelous. Arrived two days early in pristine packaging."
  },
  {
    id: "REV-10493",
    reviewer: "Markus Becker",
    product: "USB-C Multiport Docking Station",
    rating: 1,
    sentiment: "Negative",
    confidence: 0.962,
    date: "2026-10-18",
    country: "DE",
    text: "Stopped functioning after three days of light office work. Customer service offered no refund. Do not buy!"
  },
  {
    id: "REV-10494",
    reviewer: "Priya Nair",
    product: "Smart Fitness Tracker Watch",
    rating: 3,
    sentiment: "Neutral",
    confidence: 0.825,
    date: "2026-10-17",
    country: "GB",
    text: "Battery life matches the advertised 5 days, but step counting is occasionally erratic during cycling."
  },
  {
    id: "REV-10495",
    reviewer: "Lucas Dupont",
    product: "Mechanical Gaming Keyboard RGB",
    rating: 5,
    sentiment: "Positive",
    confidence: 0.971,
    date: "2026-10-17",
    country: "FR",
    text: "Crisp tactile clicks, ultra-responsive keys, and smooth software configuration. Highly recommended for developers!"
  },
  {
    id: "REV-10496",
    reviewer: "Chen Wei",
    product: "Ultra High-Speed External SSD 2TB",
    rating: 2,
    sentiment: "Negative",
    confidence: 0.915,
    date: "2026-10-16",
    country: "US",
    text: "Thermal throttling occurs after transferring large video datasets. Speeds drop drastically from 1000MB/s down to 80MB/s."
  }
];

export const SPARK_CLUSTER_METRICS = {
  clusterState: "RUNNING • HEALTHY",
  sparkVersion: "PySpark 3.5.1",
  master: "spark://10.0.4.12:7077",
  workerNodes: [
    { id: "worker-01", ip: "10.0.4.101", cores: 8, memory: "32 GB", memoryUsed: "18.4 GB", status: "Active" },
    { id: "worker-02", ip: "10.0.4.102", cores: 8, memory: "32 GB", memoryUsed: "21.1 GB", status: "Active" },
    { id: "worker-03", ip: "10.0.4.103", cores: 8, memory: "32 GB", memoryUsed: "17.9 GB", status: "Active" },
    { id: "worker-04", ip: "10.0.4.104", cores: 8, memory: "32 GB", memoryUsed: "19.5 GB", status: "Active" }
  ],
  totalCores: 32,
  allocatedMemory: "128 GB",
  usedMemory: "76.9 GB",
  throughputRecordsSec: 18450,
  activeJobs: 1,
  completedStages: 124,
  failedStages: 0,
  shuffleReadBytes: "4.8 GB",
  shuffleWriteBytes: "4.7 GB"
};
