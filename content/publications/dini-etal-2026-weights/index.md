---
title: 'From Weights to Representations: How Pre-Training Data Order Shapes Language Models'

# Authors
# If you created a profile for a user (e.g. the default `me` user), write the username (folder name) here
# and it will be replaced with their full name and linked to their profile.
authors:
  - me
  - Lucia Domenichelli
  - Dominique Brunato
  - Felice Dell’Orletta

date: '2026-09-14T00:00:00Z'

# Schedule page publish date (NOT publication's date).
# publishDate: '2026-09-24T00:00:00Z'

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard.
publication_types: ['paper-conference']

# Publication name and optional abbreviated publication name.
# NOTE: proceedings not published yet at the time of writing (Palermo, Italy, September 14-16, 2026).
publication: "In *Proceedings of the Twelfth Italian Conference on Computational Linguistics* (CLiC-it 2026)"
publication_short: In *CLiC-it 2026*
venue_short: CLiC-it 2026

abstract: "Neural Language Models can exhibit similar behavior while converging to different internal solutions, in terms of both learned weights and induced sentence representations. In this work, we ask whether the order of pre-training examples contributes to this divergence. Prior studies have shown that pre-training data ordering affects both learning dynamics and the properties encoded in the resulting representations, but its role in shaping the similarity between models trained on different orders remains less understood. We study this question in a controlled setting by comparing GPT-style models pre-trained with identical architecture, initialization, and corpus, varying only the sequence in which examples are presented. We measure how training order shapes model similarity across weight and representation spaces, comparing layer-wise weight matrices and the corresponding component-level activations. We also investigate whether distances in parameter space are reflected in representational distances, and examine the linguistic profile of the sentences that induce the largest representational differences. Our findings characterize training order as a source of internal model divergence, linking data sequence to parameter configurations, representational structure, and input-level linguistic properties."

# # Summary. An optional shortened abstract.
# summary: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis posuere tellus ac convallis placerat. Proin tincidunt magna sed ex sollicitudin condimentum.

tags:
  - Curriculum Learning
  - Pretraining
  - Representations

# Display this page in the Featured widget?
featured: false

# Standard identifiers for auto-linking
# hugoblox:
#   ids:
#     doi: 10.5555/123456

# Custom links
# Proceedings not published yet - add pdf/code links once available.
# links:
#   - type: pdf
#     url: ""
#   - type: code
#     url: ""
# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# image:
#   caption: 'Image credit: [**Unsplash**](https://unsplash.com/photos/pLCdAaMFLTE)'
#   focal_point: ''
#   preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
# projects:
#   - example

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
# slides: ""
---
