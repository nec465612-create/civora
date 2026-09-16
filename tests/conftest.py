import pytest


@pytest.fixture(autouse=True)
def configure_direct_mode(direct_vm, direct_alice):
    direct_vm.sender = direct_alice
    direct_vm.strict_mocks = False
    direct_vm.check_pickling = True
    direct_vm.warp("2026-08-25T12:00:00+00:00")
    yield
