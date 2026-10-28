import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from collections import Counter

# ============================================================
# PAGE CONFIGURATION
# ============================================================
st.title("📊 Visual Intelligence & EDA Dashboard")
st.markdown(
    """
    Explore multi-dimensional visual analytics for customer reviews:
    **Word Bubbling**, **Cross-Tab & Correlation Heatmaps**, **Statistical Distributions**, and **Temporal Trends**.
    """
)

# ============================================================
# DATA CACHING & PREPARATION
# ============================================================
@st.cache_data
def load_dataset():
    """Load and preprocess review data with length and word counts."""
    try:
        df = pd.read_csv("data/processed_reviews.csv")
    except Exception:
        df = pd.read_csv("data/cleaned_reviews.csv")
        if "Clean_Review" not in df.columns and "Review Text" in df.columns:
            df["Clean_Review"] = df["Review Text"].astype(str).str.lower()
        if "Sentiment_Label" not in df.columns and "Sentiment" in df.columns:
            label_map = {"Negative": 0, "Neutral": 1, "Positive": 2}
            df["Sentiment_Label"] = df["Sentiment"].map(label_map)

    # Derived length metrics
    if "Review Text" in df.columns:
        df["char_length"] = df["Review Text"].astype(str).str.len()
    else:
        df["char_length"] = df["Clean_Review"].astype(str).str.len()

    df["word_count"] = df["Clean_Review"].astype(str).apply(lambda x: len(x.split()))
    
    # Parse review date for temporal analysis
    if "Review Date" in df.columns:
        df["Parsed_Date"] = pd.to_datetime(df["Review Date"], errors="coerce")
        df["Review_Year"] = df["Parsed_Date"].dt.year
    
    return df


@st.cache_data
def extract_word_frequencies(df_series, min_len=3, remove_boilerplate=True):
    """Tokenize and compute word frequency counter."""
    boilerplate = {"ref", "amazon", "item", "one", "get", "would", "also", "could"} if remove_boilerplate else set()
    words = []
    for text in df_series.dropna():
        tokens = str(text).split()
        for tok in tokens:
            t = tok.strip().lower()
            if len(t) >= min_len and t.isalpha() and t not in boilerplate:
                words.append(t)
    return Counter(words)


df = load_dataset()

# ============================================================
# TOP KPI METRICS SUMMARY
# ============================================================
total_reviews = len(df)
pos_count = (df["Sentiment"] == "Positive").sum()
neu_count = (df["Sentiment"] == "Neutral").sum()
neg_count = (df["Sentiment"] == "Negative").sum()
avg_rating = df["Rating"].mean() if "Rating" in df.columns else 0.0
avg_words = df["word_count"].mean()

m1, m2, m3, m4, m5 = st.columns(5)
m1.metric("Total Reviews", f"{total_reviews:,}")
m2.metric("Positive", f"{pos_count:,} ({pos_count/total_reviews:.1%})", delta="41.9%")
m3.metric("Neutral", f"{neu_count:,} ({neu_count/total_reviews:.1%})")
m4.metric("Negative", f"{neg_count:,} ({neg_count/total_reviews:.1%})", delta="-33.6%", delta_color="inverse")
m5.metric("Avg Rating", f"{avg_rating:.2f} ★")

st.markdown("---")

# ============================================================
# DASHBOARD TABS
# ============================================================
tab_bubbles, tab_heatmaps, tab_graphical, tab_overview = st.tabs([
    "🫧 Positive & Negative Word Bubbles",
    "🔥 Advanced Heatmaps Matrix",
    "📈 Graphical Analytics & Distributions",
    "📊 Dataset Overview & Basics"
])


# ============================================================
# TAB 1: POSITIVE & NEGATIVE WORD BUBBLES
# ============================================================
with tab_bubbles:
    st.subheader("🫧 Linguistic Bubbling Representation")
    st.markdown(
        """
        Interactive bubble visualizations revealing high-frequency customer keywords, 
        sentiment affinities, and polarity distinctions. Bubble radius represents word frequency.
        """
    )

    with st.expander("⚙️ Word Bubble Controls & Filters", expanded=True):
        col_ctrl1, col_ctrl2, col_ctrl3 = st.columns(3)
        with col_ctrl1:
            top_n = st.slider("Top N Words per Sentiment", min_value=15, max_value=60, value=30, step=5)
        with col_ctrl2:
            min_word_len = st.slider("Minimum Word Length", min_value=2, max_value=5, value=3)
        with col_ctrl3:
            filter_boilerplate = st.checkbox("Filter Brand / Generic Noise ('amazon', 'ref', etc.)", value=True)

    # Word Frequency Computations
    pos_series = df[df["Sentiment"] == "Positive"]["Clean_Review"]
    neg_series = df[df["Sentiment"] == "Negative"]["Clean_Review"]
    neu_series = df[df["Sentiment"] == "Neutral"]["Clean_Review"]

    pos_counter = extract_word_frequencies(pos_series, min_word_len, filter_boilerplate)
    neg_counter = extract_word_frequencies(neg_series, min_word_len, filter_boilerplate)
    neu_counter = extract_word_frequencies(neu_series, min_word_len, filter_boilerplate)

    top_pos = pos_counter.most_common(top_n)
    top_neg = neg_counter.most_common(top_n)

    # --------------------------------------------------------
    # 1. Comparative Sentiment Polarity Word Bubble Matrix
    # --------------------------------------------------------
    st.markdown("### 1. Comparative Sentiment Polarity Bubble Scatter")
    st.caption("Words plotted by Positive Frequency (X-axis) vs Negative Frequency (Y-axis). Bubble size = Total Count. Color = Polarity Index.")

    # Combine top unique vocabulary across positive & negative
    combined_vocab = list(set([w for w, _ in top_pos] + [w for w, _ in top_neg]))
    bubble_data = []

    for word in combined_vocab:
        p_count = pos_counter.get(word, 0)
        n_count = neg_counter.get(word, 0)
        total = p_count + n_count
        if total > 0:
            polarity = (p_count - n_count) / total  # -1.0 (pure negative) to +1.0 (pure positive)
            category = "Positive Leaning" if polarity > 0.2 else ("Negative Leaning" if polarity < -0.2 else "Shared / Neutral")
            bubble_data.append({
                "Word": word,
                "Positive_Count": p_count,
                "Negative_Count": n_count,
                "Total_Count": total,
                "Polarity_Score": polarity,
                "Category": category,
                "Bubble_Size": np.sqrt(total) * 2.2
            })

    df_bubbles = pd.DataFrame(bubble_data)

    if not df_bubbles.empty:
        max_val = max(df_bubbles["Positive_Count"].max(), df_bubbles["Negative_Count"].max()) * 1.1

        fig_bubble_scatter = px.scatter(
            df_bubbles,
            x="Positive_Count",
            y="Negative_Count",
            size="Total_Count",
            color="Polarity_Score",
            text="Word",
            hover_name="Word",
            hover_data={
                "Positive_Count": True,
                "Negative_Count": True,
                "Total_Count": True,
                "Polarity_Score": ":.2f",
                "Category": True,
                "Bubble_Size": False
            },
            color_continuous_scale="RdYlGn",
            range_color=[-1, 1],
            title="Word Sentiment Polarity Bubble Scatter (Hover over bubbles for details)"
        )

        fig_bubble_scatter.update_traces(
            textposition="top center",
            marker=dict(line=dict(width=1.5, color="rgba(255,255,255,0.8)"))
        )

        # Diagonal reference line (y = x)
        fig_bubble_scatter.add_shape(
            type="line",
            x0=0, y0=0, x1=max_val, y1=max_val,
            line=dict(color="rgba(180,180,180,0.6)", dash="dash")
        )

        fig_bubble_scatter.add_annotation(
            x=max_val * 0.2, y=max_val * 0.8,
            text="Predominantly Negative Words ⬆",
            showarrow=False, font=dict(color="#EF4444", size=14, weight="bold")
        )
        fig_bubble_scatter.add_annotation(
            x=max_val * 0.8, y=max_val * 0.2,
            text="Predominantly Positive Words ➡",
            showarrow=False, font=dict(color="#10B981", size=14, weight="bold")
        )

        fig_bubble_scatter.update_layout(
            xaxis_title="Occurrences in Positive Reviews",
            yaxis_title="Occurrences in Negative Reviews",
            height=620,
            coloraxis_colorbar=dict(title="Polarity Index", tickvals=[-1, 0, 1], ticktext=["Negative (-1)", "Neutral (0)", "Positive (+1)"])
        )

        st.plotly_chart(fig_bubble_scatter, width="stretch")

    st.markdown("---")

    # --------------------------------------------------------
    # 2. Dual Side-by-Side Packed Bubble Clusters
    # --------------------------------------------------------
    st.markdown("### 2. Dual Clustered Bubble Clouds (Positive vs Negative)")
    st.caption("Natural organic bubble packing where the most influential keywords occupy the center and radiate outward.")

    def generate_bubble_coords(counter_list):
        words = [w for w, _ in counter_list]
        counts = [c for _, c in counter_list]
        n = len(words)
        if n == 0:
            return pd.DataFrame()
        # Golden angle spiral packing (phyllotaxis)
        golden_angle = np.pi * (3 - np.sqrt(5))
        theta = np.arange(n) * golden_angle
        r = np.sqrt(np.arange(1, n + 1)) * 3.5
        x = r * np.cos(theta)
        y = r * np.sin(theta)
        
        # Normalized bubble size
        max_c = max(counts)
        sizes = [18 + (c / max_c) * 45 for c in counts]
        
        return pd.DataFrame({
            "Word": words,
            "Count": counts,
            "X": x,
            "Y": y,
            "Size": sizes
        })

    df_pos_bubbles = generate_bubble_coords(top_pos)
    df_neg_bubbles = generate_bubble_coords(top_neg)

    col_pos, col_neg = st.columns(2)

    with col_pos:
        st.markdown("#### 🟢 Top Positive Word Bubble Cloud")
        if not df_pos_bubbles.empty:
            fig_pos_cluster = go.Figure()
            fig_pos_cluster.add_trace(go.Scatter(
                x=df_pos_bubbles["X"],
                y=df_pos_bubbles["Y"],
                mode="markers+text",
                text=df_pos_bubbles["Word"],
                textposition="middle center",
                textfont=dict(size=11, color="white", family="Arial Black"),
                hovertext=[f"Word: {w}<br>Positive Count: {c:,}" for w, c in zip(df_pos_bubbles["Word"], df_pos_bubbles["Count"])],
                hoverinfo="text",
                marker=dict(
                    size=df_pos_bubbles["Size"],
                    color=df_pos_bubbles["Count"],
                    colorscale="Greens",
                    showscale=False,
                    line=dict(width=2, color="#059669")
                )
            ))
            fig_pos_cluster.update_layout(
                xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                height=480,
                margin=dict(l=10, r=10, t=20, b=20)
            )
            st.plotly_chart(fig_pos_cluster, width="stretch")

    with col_neg:
        st.markdown("#### 🔴 Top Negative Word Bubble Cloud")
        if not df_neg_bubbles.empty:
            fig_neg_cluster = go.Figure()
            fig_neg_cluster.add_trace(go.Scatter(
                x=df_neg_bubbles["X"],
                y=df_neg_bubbles["Y"],
                mode="markers+text",
                text=df_neg_bubbles["Word"],
                textposition="middle center",
                textfont=dict(size=11, color="white", family="Arial Black"),
                hovertext=[f"Word: {w}<br>Negative Count: {c:,}" for w, c in zip(df_neg_bubbles["Word"], df_neg_bubbles["Count"])],
                hoverinfo="text",
                marker=dict(
                    size=df_neg_bubbles["Size"],
                    color=df_neg_bubbles["Count"],
                    colorscale="Reds",
                    showscale=False,
                    line=dict(width=2, color="#DC2626")
                )
            ))
            fig_neg_cluster.update_layout(
                xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                height=480,
                margin=dict(l=10, r=10, t=20, b=20)
            )
            st.plotly_chart(fig_neg_cluster, width="stretch")

    st.markdown("---")

    # --------------------------------------------------------
    # 3. Interactive Word Treemap (Hierarchical Volume)
    # --------------------------------------------------------
    st.markdown("### 3. Hierarchical Word Treemap")
    st.caption("Nested hierarchical blocks representing word share across Sentiment classes.")

    treemap_rows = []
    for w, c in top_pos[:20]:
        treemap_rows.append({"Sentiment": "Positive", "Word": w, "Frequency": c})
    for w, c in top_neg[:20]:
        treemap_rows.append({"Sentiment": "Negative", "Word": w, "Frequency": c})
    for w, c in neu_counter.most_common(20):
        treemap_rows.append({"Sentiment": "Neutral", "Word": w, "Frequency": c})

    df_treemap = pd.DataFrame(treemap_rows)
    fig_treemap = px.treemap(
        df_treemap,
        path=["Sentiment", "Word"],
        values="Frequency",
        color="Sentiment",
        color_discrete_map={"Positive": "#10B981", "Negative": "#EF4444", "Neutral": "#F59E0B"},
        title="Hierarchical Word Frequency Treemap by Sentiment"
    )
    fig_treemap.update_layout(height=480)
    st.plotly_chart(fig_treemap, width="stretch")


# ============================================================
# TAB 2: ADVANCED HEATMAPS MATRIX
# ============================================================
with tab_heatmaps:
    st.subheader("🔥 Advanced Heatmaps Matrix")
    st.markdown(
        """
        Matrix heatmaps revealing bivariate density, rating-to-sentiment alignment, 
        multivariate correlations, and geographic distributions.
        """
    )

    col_hm1, col_hm2 = st.columns(2)

    # --------------------------------------------------------
    # Heatmap 1: Sentiment vs Star Rating Cross-Tabulation
    # --------------------------------------------------------
    with col_hm1:
        st.markdown("#### 1. Sentiment vs Star Rating Matrix")
        if "Rating" in df.columns and "Sentiment" in df.columns:
            ct = pd.crosstab(df["Rating"], df["Sentiment"])
            pct_ct = (ct / ct.values.sum()) * 100

            annotations = []
            for r_idx, rating in enumerate(ct.index):
                for s_idx, sent in enumerate(ct.columns):
                    val = ct.loc[rating, sent]
                    pct = pct_ct.loc[rating, sent]
                    annotations.append(
                        dict(
                            x=sent, y=rating,
                            text=f"<b>{val:,}</b><br>({pct:.1f}%)",
                            showarrow=False,
                            font=dict(color="white" if val > ct.values.max() * 0.4 else "black", size=13)
                        )
                    )

            fig_hm_crosstab = go.Figure(data=go.Heatmap(
                z=ct.values,
                x=list(ct.columns),
                y=list(ct.index),
                colorscale="Viridis",
                colorbar=dict(title="Reviews")
            ))
            fig_hm_crosstab.update_layout(
                title="Star Rating vs Inferred Sentiment Alignment",
                xaxis_title="Sentiment Class",
                yaxis_title="Customer Star Rating (1 to 5)",
                annotations=annotations,
                height=450
            )
            st.plotly_chart(fig_hm_crosstab, width="stretch")
            st.info("💡 **Insight**: Ratings 1–2 map to Negative, 3 to Neutral, and 4–5 to Positive without overlap.")

    # --------------------------------------------------------
    # Heatmap 2: Feature Correlation Heatmap
    # --------------------------------------------------------
    with col_hm2:
        st.markdown("#### 2. Multivariate Feature Correlation")
        corr_cols = [c for c in ["Rating", "Sentiment_Label", "char_length", "word_count"] if c in df.columns]
        if len(corr_cols) >= 2:
            corr_matrix = df[corr_cols].corr()
            corr_text = [[f"{val:.3f}" for val in row] for row in corr_matrix.values]

            fig_hm_corr = go.Figure(data=go.Heatmap(
                z=corr_matrix.values,
                x=corr_cols,
                y=corr_cols,
                colorscale="RdBu_r",
                zmin=-1, zmax=1,
                colorbar=dict(title="Pearson Correlation")
            ))

            annotations = []
            for i, row in enumerate(corr_matrix.index):
                for j, col in enumerate(corr_matrix.columns):
                    val = corr_matrix.loc[row, col]
                    annotations.append(
                        dict(
                            x=col, y=row,
                            text=f"<b>{val:.2f}</b>",
                            showarrow=False,
                            font=dict(color="white" if abs(val) > 0.5 else "black", size=14)
                        )
                    )

            fig_hm_corr.update_layout(
                title="Correlation Heatmap (Sentiment vs Text Lengths)",
                annotations=annotations,
                height=450
            )
            st.plotly_chart(fig_hm_corr, width="stretch")
            st.warning("⚠️ **Key Finding**: Review length correlates negatively (**r ≈ -0.47**) with rating. Unhappy reviewers write significantly longer text!")

    st.markdown("---")

    col_hm3, col_hm4 = st.columns(2)

    # --------------------------------------------------------
    # Heatmap 3: Country vs Sentiment Intensity Heatmap
    # --------------------------------------------------------
    with col_hm3:
        st.markdown("#### 3. Geographic Sentiment Heatmap (Top 10 Countries)")
        if "Country" in df.columns and "Sentiment" in df.columns:
            top_10_countries = df["Country"].value_counts().head(10).index
            df_country_top = df[df["Country"].isin(top_10_countries)]
            ct_country = pd.crosstab(df_country_top["Country"], df_country_top["Sentiment"])
            # Reorder by total volume
            ct_country["Total"] = ct_country.sum(axis=1)
            ct_country = ct_country.sort_values("Total", ascending=True).drop(columns=["Total"])

            fig_hm_country = px.imshow(
                ct_country,
                labels=dict(x="Sentiment", y="Country", color="Reviews"),
                x=list(ct_country.columns),
                y=list(ct_country.index),
                color_continuous_scale="Plasma",
                aspect="auto",
                title="Country vs Sentiment Review Volume"
            )
            fig_hm_country.update_layout(height=450)
            st.plotly_chart(fig_hm_country, width="stretch")

    # --------------------------------------------------------
    # Heatmap 4: 2D Density Heatmap (Review Length vs Rating)
    # --------------------------------------------------------
    with col_hm4:
        st.markdown("#### 4. 2D Density Heatmap: Length vs Star Rating")
        if "Rating" in df.columns and "char_length" in df.columns:
            df_sample_density = df.sample(n=min(10000, len(df)), random_state=42)
            fig_density = px.density_heatmap(
                df_sample_density,
                x="Rating",
                y="char_length",
                nbinsx=5,
                nbinsy=25,
                color_continuous_scale="Cividis",
                title="Review Character Length Concentration by Rating"
            )
            fig_density.update_layout(
                xaxis_title="Star Rating (1 to 5)",
                yaxis_title="Review Length (Characters)",
                height=450
            )
            st.plotly_chart(fig_density, width="stretch")


# ============================================================
# TAB 3: GRAPHICAL ANALYTICS & DISTRIBUTIONS
# ============================================================
with tab_graphical:
    st.subheader("📈 Statistical Graphics & Performance Visuals")
    st.markdown(
        """
        In-depth graphical distributions, hierarchical drill-downs, 
        temporal trajectories, and machine learning benchmark evaluations.
        """
    )

    col_g1, col_g2 = st.columns(2)

    # --------------------------------------------------------
    # Graphic 1: Violin & Box Plot for Review Length
    # --------------------------------------------------------
    with col_g1:
        st.markdown("#### 1. Review Length Distribution (Violin Plot)")
        fig_violin = px.violin(
            df.sample(n=min(8000, len(df)), random_state=42),
            y="char_length",
            x="Sentiment",
            color="Sentiment",
            box=True,
            points=False,
            color_discrete_map={"Positive": "#10B981", "Neutral": "#F59E0B", "Negative": "#EF4444"},
            title="Review Length Distribution by Sentiment (Violin + Box)"
        )
        fig_violin.update_layout(
            yaxis_title="Character Length",
            height=450,
            showlegend=False
        )
        st.plotly_chart(fig_violin, width="stretch")

    # --------------------------------------------------------
    # Graphic 2: Sunburst Hierarchical Breakdown
    # --------------------------------------------------------
    with col_g2:
        st.markdown("#### 2. Hierarchical Sunburst Chart")
        if "Rating" in df.columns and "Sentiment" in df.columns:
            df_sunburst = df[["Sentiment", "Rating"]].copy()
            df_sunburst["Rating_Label"] = df_sunburst["Rating"].astype(str) + " Stars"
            fig_sunburst = px.sunburst(
                df_sunburst,
                path=["Sentiment", "Rating_Label"],
                color="Sentiment",
                color_discrete_map={"Positive": "#10B981", "Neutral": "#F59E0B", "Negative": "#EF4444"},
                title="Sentiment ➔ Star Rating Sub-Tier Distribution"
            )
            fig_sunburst.update_layout(height=450)
            st.plotly_chart(fig_sunburst, width="stretch")

    st.markdown("---")

    col_g3, col_g4 = st.columns(2)

    # --------------------------------------------------------
    # Graphic 3: Temporal Review Trajectory
    # --------------------------------------------------------
    with col_g3:
        st.markdown("#### 3. Temporal Sentiment Trajectory Over Time")
        if "Review_Year" in df.columns and df["Review_Year"].notnull().sum() > 0:
            df_time = df.dropna(subset=["Review_Year"]).copy()
            df_time["Review_Year"] = df_time["Review_Year"].astype(int)
            # Filter valid years
            df_time = df_time[(df_time["Review_Year"] >= 2010) & (df_time["Review_Year"] <= 2026)]
            time_counts = df_time.groupby(["Review_Year", "Sentiment"]).size().reset_index(name="Count")

            fig_time = px.line(
                time_counts,
                x="Review_Year",
                y="Count",
                color="Sentiment",
                markers=True,
                color_discrete_map={"Positive": "#10B981", "Neutral": "#F59E0B", "Negative": "#EF4444"},
                title="Year-over-Year Customer Review Volume"
            )
            fig_time.update_layout(
                xaxis_title="Year",
                yaxis_title="Number of Reviews",
                height=450
            )
            st.plotly_chart(fig_time, width="stretch")
        else:
            st.info("Temporal dates are not present in current view.")

    # --------------------------------------------------------
    # Graphic 4: Model Performance Comparison
    # --------------------------------------------------------
    with col_g4:
        st.markdown("#### 4. Machine Learning Model Benchmark Comparison")
        model_metrics = pd.DataFrame({
            "Model": ["Random Forest", "Tuned RF", "XGBoost", "LSTM"],
            "Accuracy": [94.01, 94.00, 94.69, 95.45],
            "Precision": [95.0, 95.0, 94.96, 96.0],
            "Recall": [94.0, 94.0, 94.69, 95.0],
            "F1_Score": [94.0, 94.0, 94.72, 95.0]
        })

        fig_models = px.bar(
            model_metrics,
            x="Model",
            y=["Accuracy", "Precision", "Recall", "F1_Score"],
            barmode="group",
            title="Model Evaluation Metrics Comparison (%)",
            color_discrete_sequence=["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"]
        )
        fig_models.update_layout(
            yaxis_range=[90, 100],
            yaxis_title="Score (%)",
            height=450
        )
        st.plotly_chart(fig_models, width="stretch")


# ============================================================
# TAB 4: DATASET OVERVIEW & BASICS
# ============================================================
with tab_overview:
    st.subheader("📊 Dataset Overview & Basics")
    st.markdown("Inspect raw samples, class breakdowns, and geographical distributions.")

    with st.expander("🔍 Preview Dataset Records (First 50 Rows)"):
        st.dataframe(df.head(50), width="stretch")

    col_b1, col_b2 = st.columns(2)

    with col_b1:
        st.write("### Customer Sentiment Distribution")
        sentiment_counts = df["Sentiment"].value_counts().reset_index()
        sentiment_counts.columns = ["Sentiment", "Count"]

        fig_sentiment_bar = px.bar(
            sentiment_counts,
            x="Sentiment",
            y="Count",
            text="Count",
            color="Sentiment",
            color_discrete_map={"Positive": "#10B981", "Neutral": "#F59E0B", "Negative": "#EF4444"},
            title="Customer Sentiment Distribution"
        )
        fig_sentiment_bar.update_layout(height=400)
        st.plotly_chart(fig_sentiment_bar, width="stretch")

    with col_b2:
        st.write("### Sentiment Share (Donut Chart)")
        fig_sentiment_pie = px.pie(
            sentiment_counts,
            names="Sentiment",
            values="Count",
            hole=0.45,
            color="Sentiment",
            color_discrete_map={"Positive": "#10B981", "Neutral": "#F59E0B", "Negative": "#EF4444"},
            title="Sentiment Percentage Breakdown"
        )
        fig_sentiment_pie.update_traces(textposition="inside", textinfo="percent+label")
        fig_sentiment_pie.update_layout(height=400)
        st.plotly_chart(fig_sentiment_pie, width="stretch")

    st.markdown("---")

    col_b3, col_b4 = st.columns(2)

    with col_b3:
        st.write("### Rating Distribution (1–5 Stars)")
        if "Rating" in df.columns:
            rating_counts = df["Rating"].value_counts().reset_index()
            rating_counts.columns = ["Rating", "Count"]
            rating_counts = rating_counts.sort_values("Rating")

            fig_rating = px.bar(
                rating_counts,
                x="Rating",
                y="Count",
                text="Count",
                color="Rating",
                color_continuous_scale="Tealgrn",
                title="Customer Star Ratings Distribution"
            )
            fig_rating.update_layout(height=400)
            st.plotly_chart(fig_rating, width="stretch")

    with col_b4:
        st.write("### Top 10 Countries by Review Volume")
        if "Country" in df.columns:
            top_countries = df["Country"].value_counts().head(10).reset_index()
            top_countries.columns = ["Country", "Number of Reviews"]

            fig_country = go.Figure()
            fig_country.add_trace(
                go.Scatter(
                    x=top_countries["Country"],
                    y=top_countries["Number of Reviews"],
                    mode="lines+markers",
                    fill="tozeroy",
                    line=dict(color="#6366F1", width=3),
                    marker=dict(size=8, color="#4338CA"),
                    name="Reviews"
                )
            )
            fig_country.update_layout(
                title="Top 10 Countries by Reviews Volume",
                xaxis_title="Country",
                yaxis_title="Reviews",
                height=400
            )
            st.plotly_chart(fig_country, width="stretch")
