from threading import Timer
def set_timeout(fn, delay):
    Timer(delay, fn).start()

set_timeout(lambda: print('Hello'), 1)
print('World')

