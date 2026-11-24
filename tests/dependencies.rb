# Run with: bundle exec ruby tests/dependencies.rb
require 'webrick'
require 'stringio'
require 'addressable/uri'

# Forbidden trailers must not overwrite request framing or routing metadata.
request = WEBrick::HTTPRequest.new(WEBrick::Config::HTTP)
request.parse(StringIO.new("POST / HTTP/1.1\r\nHost: localhost\r\nTransfer-Encoding: chunked\r\nTrailer: Host, Foo, Content-Length\r\n\r\n1\r\na\r\n0\r\nContent-Length: 5\r\nHost: attacker.example\r\nFoo: allowed\r\n\r\n"))
raise 'body changed' unless request.body == 'a'
raise 'trailer content-length was promoted' unless request['content-length'].nil?
raise 'trailer host was promoted' unless request['host'] == 'localhost'
raise 'allowed trailer was dropped' unless request['foo'] == 'allowed'
raise 'dot-segment normalization mismatch' unless Addressable::URI.normalize_path('/../../public/x/../../secret') == '/secret'
puts 'Dependency regressions passed: request trailers and URI normalization.'
