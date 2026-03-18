---
title: 'From Human Reading to NLM Understanding: Evaluating the Role of Eye-Tracking Data in Encoder-Based Models'

# Authors
# If you created a profile for a user (e.g. the default `me` user), write the username (folder name) here
# and it will be replaced with their full name and linked to their profile.
authors:
  - me
  - Lucia Domenichelli
  - Dominique Brunato
  - Felice Dell’Orletta

date: '2025-07-27T00:00:00Z'

# Schedule page publish date (NOT publication's date).
# publishDate: '2025-09-24T00:00:00Z'

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard.
publication_types: ['paper-conference']

# Publication name and optional abbreviated publication name.
publication: "In *Proceedings of the 63rd Annual Meeting of the Association for Computational Linguistics* (Volume 1: Long Papers)"
publication_short: In *ACL 2025*
venue_short: ACL 2025

abstract: "Cognitive signals, particularly eye-tracking data, offer valuable insights into human language processing. Leveraging eye-gaze data from the Ghent Eye-Tracking Corpus, we conducted a series of experiments to examine how integrating knowledge of human reading behavior impacts Neural Language Models (NLMs) across multiple dimensions: task performance, attention mechanisms, and the geometry of their embedding space. We explored several fine-tuning methodologies to inject eye-tracking features into the models. Our results reveal that incorporating these features does not degrade downstream task performance, enhances alignment between model attention and human attention patterns, and compresses the geometry of the embedding space."

# # Summary. An optional shortened abstract.
# summary: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis posuere tellus ac convallis placerat. Proin tincidunt magna sed ex sollicitudin condimentum.

tags:
  - Eye-tracking
  - Attention
  - Representations

# Display this page in the Featured widget?
featured: false

# Standard identifiers for auto-linking
# hugoblox:
#   ids:
#     doi: 10.5555/123456

# Custom links
links:
  - type: pdf
    url: https://aclanthology.org/2025.acl-long.870.pdf
  - type: code
    url: https://github.com/lucadinidue/eye_tracking_injection
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