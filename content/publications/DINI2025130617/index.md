---
title: "In the eyes of a language model: A comprehensive examination through eye-tracking data"
authors:
- me
- Luca Moroni
- Dominique Brunato
- Felice Dell'Orletta

date: "2025-10-14T00:00:00Z"

# Schedule page publish date (NOT publication's date).
# publishDate: "2017-01-01T00:00:00Z"

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard.
publication_types: ["article-journal"]

# Publication name and optional abbreviated publication name.
publication: "Neurocomputing"
publication_short: "Neurocomputing"
venue_short: Neurocomputing

abstract: Cognitive signals, particularly eye-tracking data, offer a unique lens for understanding human sentence processing. Leveraging eye-gaze data from the English and Italian section of the Multilingual Eye-Movement Corpus (MECO), we designed a series of experiments aiming at exploring whether pre-trained neural language models (NLMs) encode patterns representative of human reading behavior and if directly incorporating this information through a fine-tuning process influences the cognitive plausibility of the model. Additionally, we sought to determine if such an impact persists through a downstream task. Our findings reveal that transformers encode eye-gaze-related information during pretraining and that explicitly integrating eye-tracking features increases model alignment with human attention. When investigating the effect of intermediate fine-tuning on eye-tracking data on the model’s performance on a downstream task, we observe that this intermediate step does not result in catastrophic forgetting, despite the very different nature of the considered downstream task. In addition, the attention mechanism of models undergoing intermediate fine-tuning remains closely aligned with human attention. In conclusion, our comprehensive evaluation of NLMs informed by human attention patterns offers great potential for advancing the growing field of eXplainable Artificial Intelligence (XAI). Grounding language models in real-world cognitive processes enables the creation of systems that not only replicate human language output but also align with the cognitive mechanisms behind reading and comprehension. This alignment with human behavior enhances model adaptability, interpretability, and effectiveness, fostering more human-centric, transparent, and reliable AI applications across various domains.

# Summary. An optional shortened abstract.
summary: 

tags:
- Eye-tracking
- Attention
featured: false

hugoblox:
  ids:
    arxiv: 

links:
  - type: pdf
    url: https://pdf.sciencedirectassets.com/271597/1-s2.0-S0925231225X0031X/1-s2.0-S0925231225012895/main.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEEaCXVzLWVhc3QtMSJHMEUCIBZHvomv%2FvKs16EQgKim8qsJncOuxuUPd2HOxMce9UnyAiEA4tlDQR5o2bal5mr9BhQm6o2kWIfXx7OTipdcvUp4sogqswUIChAFGgwwNTkwMDM1NDY4NjUiDMxKemlLdxniBi39uCqQBU%2Fd8HLMmu7pnIrA2A%2FmJFjlmGp0gh%2FWw3HLWhbF115z%2BtKICr5%2FMWkcplIVh3B1iFTHG0ts7VhUvyOA%2FPOQbiOLvNOZ7teDLdHfPDBj4Y22t%2BbIaCuZTV2olXYNKBgzqXAft4GkwbrdyhBD8ChwT4YfdlqqenmLejqeqm3l8kfFXl2y1cB4Myehxak2gFyF1T8ltLnQmwCHGhCidPT%2B%2FoSuT2C3Sq4IogNx9xUOdKDk9nkFRRhLPPJQsUKxrw%2Fgz5qNpUpmwnYeIV1mR%2Fv%2FdaT2N5vjmQloaYZpCnmLywtSW6oQ1kKI%2BqhYqJNkNHObHXv7uK79xBSb5wHPaoZE%2F1qxnsVgvrVx%2BFU1F4Cn1%2BnSRmvbC%2FnOlUikNZUBIt6r0U6maEF8x6sE8boC6EwefG1QV6J8iGVRQnfse0NvrVScETHdboG0zJGZNIXdVqGhBHCSyut6W%2FwqfP%2FvvGoJynr4Npyz%2FLWR87wWdfJ%2B55Abdl9hTIvgWy%2BujP5aItw3AbB0yONKFtdVVZuiIyeEkRlqmEH%2FFH0Jc8zgjv9QsX3QPN4S2CV%2FSLrwddzwm%2FRI1nqeBPwjiA%2BrV5G7vAyrv5EPnXM8qhdjP016oxrDTRXponri%2FkFVo1IRxhXoUgbgGjtXB%2FitOOH3ju3dczlZDRXyXDvYDvapS49mmjaSABeS%2BCkXyUFgmji5WhBIoGfzyCgXDCl4%2BTPGbvvFF8htJdF0XbktDi7tDejCCKPsHQDeDhX9O%2FI2%2BpQ5MWSnC0%2Fqx4rVdAGgBVl%2BG59SOGf7xGq5nZMGa325JX9Es3RP5PbcESku9cIHnmojshFYhghhww3SEbRqMHtRny%2Fkc2q7L7MvGrkb8zQDRp%2Bi0ysxr9n%2BMMWj680GOrEBLa5Jygr0JS%2F22o59PAZlzhxPQS3wHaBWwXiVYUi7vZp4Y23R59yzogD5d1d9%2FUQ8MKApVQS7QiSnSqa%2BMr1TjHbQs2GjQclwhppakeAo5j17kyvDyYgno6T3q0YmCs1%2FeHCW1%2FkLKLuKfw0rPpTh8lB2zQu2Xr0e6oW6qYqlMJjyaYitc%2FO%2BvDakBmdz%2BadpjB2DZcqCX7MxmTQMved3MpQYklP9%2FBHRNSvjdhlp6MlK&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260318T172238Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAQ3PHCVTY7FKODDVF%2F20260318%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=3f387248d7061c4f1cd9f109bb5078a88d799dcd11043a68d9e794512c56598e&hash=deb81026e15d8fcd84571b9496ecd773a54ec394a948a36a6ee09288151f7650&host=68042c943591013ac2b2430a89b270f6af2c76d8dfd086a07176afe7c76c2c61&pii=S0925231225012895&tid=spdf-97cb0aa8-099a-431a-8890-87fe50373253&sid=4d58f06e84e1a6479d09051316fba40a825bgxrqa&type=client&tsoh=d3d3LnNjaWVuY2VkaXJlY3QuY29t&rh=d3d3LnNjaWVuY2VkaXJlY3QuY29t&ua=0c125d0a055a07030006&rr=9de5ebab0cb4ee93&cc=it
  - type: code
    url: https://github.com/Andrew-Wyn/augmenting_nlms_meco
  # - type: project
  #   url: ""

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder. 
# image:
#   caption: 'Image credit: [**Unsplash**](https://unsplash.com/photos/jdD8gXaTZsc)'
#   focal_point: ""
#   preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
projects: []

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
slides: ""
---