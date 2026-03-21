---
title: 'TEXT-CAKE: Challenging Language Models on Local Text Coherence'

# Authors
# If you created a profile for a user (e.g. the default `me` user), write the username (folder name) here
# and it will be replaced with their full name and linked to their profile.
authors:
  - me
  - Dominique Brunato
  - Felice Dell’Orletta
  - Tommaso Caselli

date: '2025-01-19T00:00:00Z'

# Schedule page publish date (NOT publication's date).
# publishDate: '2025-09-24T00:00:00Z'

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard.
publication_types: ['paper-conference']

# Publication name and optional abbreviated publication name.
publication: "In *Proceedings of the 31st International Conference on Computational Linguistics*"
publication_short: In *COLING 2025*
venue_short: COLING 2025

abstract: "We present a deep investigation of encoder-based Language Models (LMs) on their abilities to detect text coherence across four languages and four text genres using a new evaluation benchmark, TEXT-CAKE. We analyze both multilingual and monolingual LMs with varying architectures and parameters in different finetuning settings. Our findings demonstrate that identifying subtle perturbations that disrupt local coherence is still a challenging task. Furthermore, our results underline the importance of using diverse text genres during pre-training and of an optimal pre-traning objective and large vocabulary size. When controlling for other parameters, deep LMs (i.e., higher number of layers) have an advantage over shallow ones, even when the total number of parameters is smaller."

# # Summary. An optional shortened abstract.
# summary: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis posuere tellus ac convallis placerat. Proin tincidunt magna sed ex sollicitudin condimentum.

tags:
  - Coherence

# Display this page in the Featured widget?
featured: false

# Standard identifiers for auto-linking
# hugoblox:
#   ids:
#     doi: 10.5555/123456

# Custom links
links:
  - type: pdf
    url: https://aclanthology.org/2025.coling-main.296.pdf
  - type: code
    url: https://github.com/lucadinidue/coherence_text_cake
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