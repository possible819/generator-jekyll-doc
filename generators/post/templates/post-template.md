---
layout: post
dirpath: "<%= subDir %>"
title: "<%= title %>"
date: <%= date %>
category: Posting
tags: [<%= tags %>]
thumbnail: ""
summary: "<%= summary %>"
indexes:
  [
    <% for (let i = 0; i < indexes.length; i++) { %>
    { id: "<%= indexes[i].id %>", display: "<%= indexes[i].display %>" },
    <% } %>
  ]
published: false
---

텍스트를 입력하세요

<% for (let i = 0; i < indexes.length; i++) { %>

<h4 id="<%= indexes[i].id %>"><%= indexes[i].display %></h4>
본문 (<%= indexes[i].display %>)
<% } %>
