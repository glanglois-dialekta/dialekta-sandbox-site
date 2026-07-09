// Blogue : tracking de la sélection d'articles.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.article-card a').forEach(function (link) {
    link.addEventListener('click', function () {
      BB.dlPush({
        event: 'select_content',
        content_type: 'article_blogue',
        content_id: link.getAttribute('data-article-id'),
        content_title: link.getAttribute('data-article-title')
      });
    });
  });
});
