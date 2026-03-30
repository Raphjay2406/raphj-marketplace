/**
 * Genorah Visual Companion — Client Helper
 * WebSocket connection + click tracking for interactive screens.
 */
(function () {
  'use strict';

  var ws = null;
  var queue = [];

  function connect() {
    ws = new WebSocket('ws://' + window.location.host);

    ws.onopen = function () {
      while (queue.length > 0) {
        ws.send(queue.shift());
      }
    };

    ws.onmessage = function (event) {
      try {
        var msg = JSON.parse(event.data);
        if (msg.type === 'reload') {
          window.location.reload();
        }
      } catch (e) {
        // ignore non-JSON messages
      }
    };

    ws.onclose = function () {
      ws = null;
      setTimeout(connect, 1000);
    };
  }

  function send(data) {
    var payload = JSON.stringify(data);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    } else {
      queue.push(payload);
    }
  }

  function updateIndicator(choiceText) {
    var indicator = document.getElementById('indicator');
    if (!indicator) return;

    while (indicator.firstChild) {
      indicator.removeChild(indicator.firstChild);
    }

    var span = document.createElement('span');
    span.className = 'selected-text';
    span.textContent = choiceText;
    indicator.appendChild(span);

    var suffix = document.createTextNode(' \u2014 return to terminal to continue');
    indicator.appendChild(suffix);
  }

  document.addEventListener('click', function (e) {
    var target = e.target.closest('[data-choice]');
    if (!target) return;

    var container = target.parentElement;
    var isMultiselect = container && container.hasAttribute('data-multiselect');

    if (!isMultiselect) {
      var siblings = container ? container.querySelectorAll('[data-choice]') : [];
      for (var i = 0; i < siblings.length; i++) {
        if (siblings[i] !== target) {
          siblings[i].classList.remove('selected');
        }
      }
    }

    target.classList.toggle('selected');

    var isSelected = target.classList.contains('selected');
    var h3 = target.querySelector('h3');
    var choiceText = h3 ? h3.textContent : target.getAttribute('data-choice');

    send({
      type: 'click',
      choice: target.getAttribute('data-choice'),
      text: h3 ? h3.textContent : '',
      selected: isSelected,
      timestamp: Date.now()
    });

    if (isSelected) {
      updateIndicator(choiceText);
    }
  });

  connect();
})();
